#Imports. Using Flask and subdependencies. Using SQLAlchemy for the database, and Jinja for template rendering 
from flask import Flask, jsonify, render_template, request, g
from flask.ext.sqlalchemy import SQLAlchemy
from datetime import datetime, time


app = Flask(__name__) #the app initializer


app.config.from_object('config') #retrieves db data from the config.py file

db = SQLAlchemy(app) #database for URStudy
@app.route('/') #route to the home page (index.html)
def initialize(): #initialization function for index.html, renders homepage
    return render_template("index.html") 

@app.route('/checkin', methods=['POST']) #renders check in page (the one with the DB) by using arguments given from index.html
def checkinpage():
	class_area = request.form.get('what_class') #requests data from form
	class_is = request.form.get('section_chose')
	how_many = request.form.get('how_many')
	study_area = request.form.get('library_study')
	pub_date = request.form.get('time_start')
	end = request.form.get('time_end')
 	body_notes = request.form.get('notes_section')
	    
 	t_start = datetime.strptime(pub_date, "%I:%M%p") #these lines turn the string representations of time into timestamp objects 
 	t_end = datetime.strptime(end, "%I:%M%p")
 	d_start = datetime.utcnow()
 	the_start = d_start.replace(hour = t_start.hour, minute = t_start.minute)
 	d_end = datetime.utcnow()
 	the_end = d_end.replace(hour = t_end.hour, minute = t_end.minute)
 	check = datetime.utcnow()

	post = Post(class_area, class_is, how_many, study_area, the_start, the_end, body_notes) #finally, adds to database
	db.session.add(post)
	db.session.commit() #commits to db


	class_id = class_area + class_is 

	posts = Post.query.filter_by( class_area = class_area ) #only pulls up data for classes relevant to user's query

	'''posts = Post.query.filter(Post.end < datetime.utcnow())'''

	#uncomment this to see debug log
	'''
	do_something_wrong()
	raise
	return 'Ohnoes' 	
		'''

	return render_template("checkin.html",
	 posts = posts, 
	 class_area = class_area, 
	 class_is = class_is,
	 how_many = how_many,
	 study_area = study_area,
	 pub_date = pub_date,
	 end = end,
	 body_notes = body_notes
	 )
	#the method to load a page if a user doesn't want to add a DB entry, but instead see current ones (work in progress)
@app.route('/checkin/<class_id>', methods = ['GET'])
def show_db_data():
	posts = Post.query.filter_by( class_area = class_area)
	class_id = class_area + class_is
	return render_template("checkin.html" ,class_area = class_area, class_is = class_is)





#the db model
class Post(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    class_area = db.Column(db.String(50))
    class_is = db.Column(db.String(5))
    how_many = db.Column(db.Integer)
    study_area = db.Column(db.String(50))
    pub_date = db.Column(db.DateTime)
    end = db.Column(db.DateTime)
    body_notes = db.Column(db.Text)
   


    #initializes the DB
    def __init__(self, class_area, class_is, how_many, study_area, pub_date, end, body_notes):
      
        self.class_area = class_area
        self.class_is = class_is
        self.how_many = how_many
        self.study_area = study_area
        if pub_date is None:
            pub_date = datetime.utcnow()
        self.pub_date = pub_date
        self.end = end
        self.body_notes = body_notes
 
    
    def __repr__(self):
        return '<Post %r>' % self.end

#runs the program
if __name__ == '__main__':
	app.run(debug = True)