from watson_machine_learning_client import WatsonMachineLearningAPIClient
import math
from cloudant import Cloudant
from datetime import date,timedelta
from flask import Flask, render_template, request,Response,jsonify,redirect,url_for,make_response,session
from http import cookies
import atexit
import os
import json

#For IBM cloud watson start

# wml_credentials =  {
#   "apikey": "SUjb5zGHRaHe2A9XTD3q33eklKbi69HbKfyylv4_NMz1",
#   "iam_apikey_description": "Auto-generated for key cdb767c0-ed3f-4885-b73b-984b666f7cc5",
#   "iam_apikey_name": "Service credentials-1",
#   "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Writer",
#   "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/ada73095451441d9a0af1fd3af34974f::serviceid:ServiceId-8e8dc75b-ec6b-4a97-b643-112784e4e698",
#   "instance_id": "bda4dffe-cf02-4f03-8efd-b64959a951d9",
#   "password": "SUjb5zGHRaHe2A9XTD3q33eklKbi69HbKfyylv4_NMz1",
#   "username": "SUjb5zGHRaHe2A9XTD3q33eklKbi69HbKfyylv4_NMz1",
#   "url": "https://eu-gb.ml.cloud.ibm.com"
# }
# client = WatsonMachineLearningAPIClient( wml_credentials )

# #
# # 2.  Fill in one or both of these:
# #     - model_deployment_endpoint_url
# #     - function_deployment_endpoint_url
# #
# model_deployment_endpoint_url    = ""
# function_deployment_endpoint_url = ""

# def createPayload( canvas_data ):
#     dimension      = canvas_data["height"]
#     img            = Image.fromarray( np.asarray( canvas_data["data"] ).astype('uint8').reshape( dimension, dimension, 4 ), 'RGBA' )
#     sm_img         = img.resize( ( 28, 28 ), Image.LANCZOS )
#     alpha_arr      = np.array( sm_img.split()[-1] )
#     norm_alpha_arr = alpha_arr / 255
#     payload_arr    = norm_alpha_arr.reshape( 1, 784 )
#     payload_list   = payload_arr.tolist()
#     return { "values" : payload_list }

#End IBM cloud watson start



app = Flask(__name__, static_url_path='')
app.secret_key = 'wspythonflaskapp'
db_name = 'user_usage'
client = None
db = None

if 'VCAP_SERVICES' in os.environ:
    vcap = json.loads(os.getenv('VCAP_SERVICES'))
    print('Found VCAP_SERVICES')
    if 'cloudantNoSQLDB' in vcap:
        creds = vcap['cloudantNoSQLDB'][0]['credentials']
        user = creds['username']
        password = creds['password']
        url = 'https://' + creds['host']
        client = Cloudant(user, password, url=url, connect=True)
        db = client.create_database(db_name, throw_on_exists=False)
elif "CLOUDANT_URL" in os.environ:
    client = Cloudant(os.environ['CLOUDANT_USERNAME'], os.environ['CLOUDANT_PASSWORD'], url=os.environ['CLOUDANT_URL'], connect=True)
    db = client.create_database(db_name, throw_on_exists=False)
elif os.path.isfile('vcap-local.json'):
    with open('vcap-local.json') as f:
        vcap = json.load(f)
        print('Found local VCAP_SERVICES')
        creds = vcap['services']['cloudantNoSQLDB'][0]['credentials']
        user = creds['username']
        password = creds['password']
        url = 'https://' + creds['host']
        client = Cloudant(user, password, url=url, connect=True)
        db = client.create_database(db_name, throw_on_exists=False)

# On IBM Cloud Cloud Foundry, get the port number from the environment variable PORT
# When running this app on the local machine, default the port to 8000
port = int(os.getenv('PORT', 8000))

@app.route('/')
def root():
    session.pop('userinfo', None)
    return app.send_static_file('landing.html')

@app.route('/dashboard')
def dashboard():
    if 'userinfo' in session:
        username = session['userinfo']
        return app.send_static_file('dashboard.html')
    else:
         return redirect(url_for('login'))

@app.route('/devices')
def devices():
    return app.send_static_file('devices.html')

@app.route('/login')
def login():
    session.pop('userinfo', None)
    #username = session['userinfo']
    return app.send_static_file('login.html')

#User log in post method 
@app.route('/api/userlogin', methods=['POST', 'GET'])
def user_login():
    result=None
    if client:
        db = client.create_database('users', throw_on_exists=False)
        selector = {'username': {'$eq': request.json['username']},'password': {'$eq': request.json['password']}}
        docs = db.get_query_result(selector)
        for doc in docs:
            result=docs[0]
        #resp = make_response(app.send_static_file('dashboard.html'))
        #resp.set_cookie('userinfo', 'imad')
        #cokkie=request.cookies.get("userinfo")
        session['userinfo'] = json.dumps(result)
        #res = make_response("Setting a cookie")
        #res.set_cookie('userinfo', json.dumps(result), max_age=60*60*24*365*2)
        return jsonify(result)
    else:
        print('No database')
        return jsonify(result)

# API for inserting total usage data to table
@app.route('/api/addtotalusage', methods=['POST'])
def add_total_usage():
    #user = request.json['name']
    postalcode=71141
    yearmonth= request.json['yearmonth']
    gallons= request.json['totalgallons']
    data = {'PostalCode':postalcode,'TotalGallons':gallons,'YearMonth':yearmonth}
    if client:
        db = client.create_database('mydb', throw_on_exists=False)
        my_document = db.create_document(data)
        data['_id'] = my_document['_id']
        return jsonify(data)
    else:
        print('No database')
        return jsonify(data)

#API for getting gallons data
@app.route('/api/gettotalusage', methods=['POST'])
def get_total_usage():
    result=[]
    if client:
        db = client.create_database('user_usage', throw_on_exists=False)
        #selector = {'PostalCode': {'$eq': request.json['postalcode']}}
        selector = {'_id': {'$gt': "0"}}
        docs = db.get_query_result(selector)
        for doc in docs:
            result.append(doc)
        return jsonify(result)
    else:
        print('No database')
        return jsonify(result)

#API for getting predicted data
@app.route('/api/getpredictedgraph', methods=['POST'])
def get_predicted_graph():
    result=[]
    if client:
        db = client.create_database('prediction_db', throw_on_exists=False)
        #selector = {'PostalCode': {'$eq': request.json['postalcode']}}
        selector = {'_id': {'$gt': "0"}}
        docs = db.get_query_result(selector)
        for doc in docs:
            result.append(doc)
        return jsonify(result)
    else:
        print('No database')
        return jsonify(result)


#API for getting devices
@app.route('/api/getdevices', methods=['GET'])
def get_devices():
    result=[]
    if client:
        db = client.create_database('devices', throw_on_exists=False)
        #selector = {'PostalCode': {'$eq': request.json['postalcode']}}
        selector = {'_id': {'$gt': "0"}}
        docs = db.get_query_result(selector)
        for doc in docs:
            result.append(doc)
        return jsonify(result)
    else:
        print('No database')
        return jsonify(result)

#API for getting flow rate
@app.route('/api/getdailyflowratebydevice', methods=['POST'])
def get_daily_flowrate_by_device():
    result=[]
    if client:
        db = client.create_database('user_usage', throw_on_exists=False)
        selector = {'device_id': {'$eq': request.json['devicename']},"time": { "$gt": date.today().strftime('%Y-%m-%d'),"$lt": (date.today()+timedelta(1)).strftime('%Y-%m-%d')}}
        #selector = {'_id': {'$gt': "0"}}
        docs = db.get_query_result(selector)
        for doc in docs:
            result.append(doc)
        return jsonify(result)
    else:
        print('No database')
        return jsonify(result)


# API for New device installation
@app.route('/api/newinstall', methods=['POST'])
def new_install():
    data = request.json
    if client:
        db = client.create_database('devices', throw_on_exists=False)
        my_document = db.create_document(data)
        data['_id'] = my_document['_id']
        return jsonify(data)
    else:
        print('No database')
        return jsonify(data)


@atexit.register
def shutdown():
    if client:
        client.disconnect()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)
