#Imports. Using Flask and subdependencies. Using SQLAlchemy for the database, and Jinja for template rendering 
from flask import Flask, jsonify, render_template, request, g, flash, redirect,url_for
from flask.ext.sqlalchemy import SQLAlchemy
from datetime import datetime



app = Flask(__name__) #the app initializer


app.config.from_object('config') #retrieves db data from the config.py file

db = SQLAlchemy(app) #database for URStudy





@app.route('/')#route to the home page (index.html)
def initialize(): #initialization function for index.html, renders homepage
    return render_template("index.html") 


@app.route('/checkin', methods=['GET','POST']) #renders check in page (the one with the DB) by using arguments given from index.html
def checkinpage():
	if request.method == 'POST':
		class_area = request.form.get('what_class') #requests data from form
		class_is = request.form.get('section_chose')
		how_many = request.form.get('how_many')
		study_area = request.form.get('library_study')
		pub_date = request.form.get('time_start')
		end = request.form.get('time_end')
	 	body_notes = request.form.get('notes_section')
		    
	 	t_start = datetime.strptime(pub_date, "%I:%M%p") #these lines turn the string representations of time into timestamp objects 
	 	t_end = datetime.strptime(end, "%I:%M%p")
	 	d_start = datetime.now()
	 	the_start = d_start.replace(hour = t_start.hour, minute = t_start.minute)
	 	d_end = datetime.now()
	 	the_end = d_end.replace(hour = t_end.hour, minute = t_end.minute)
	 	check = datetime.now()

	 	post = Post(class_area, class_is, how_many, study_area, the_start, the_end, body_notes) #finally, adds to database
	 	duplicate_check = Post.query.filter_by( class_area = class_area ,class_is = class_is ,body_notes = body_notes).first()



	 	if(duplicate_check is None):
			db.session.add(post)
			db.session.commit()
		elif(post.body_notes != duplicate_check.body_notes):
			db.session.add(post)
			db.session.commit() #commits to db
		
		class_id = class_area + class_is 

		posts = Post.query.filter( Post.class_area == class_area , Post.class_is == class_is ,Post.end > datetime.now()) #only pulls up data for classes relevant to user's query

		# del_me = Post.query.filter(Post.end < datetime.now())
		#db.session.delete(del_me)
		#db.session.commit()
		'''posts = Post.query.filter(Post.end < datetime.utcnow())'''

		#uncomment this to see debug log
		
		
		# do_something_wrong()
		# raise
		# return 'Ohnoes' 	
		

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
	elif request.method == 'GET':
		class_area = request.args.get('what_class2') #requests data from form
		class_is = request.args.get('section_chose2')
		posts = Post.query.filter( Post.class_area == class_area , Post.class_is == class_is, Post.end > datetime.now()) #only pulls up data for classes relevant to user's query
		#class_id = class_area + class_is
		
		# do_something_wrong()
		# raise
		# return 'Ohnoes'
		
		return render_template("checkin.html",  posts = posts, class_area = class_area, class_is = class_is)


# @app.route('/checkin/<class_id>', methods = ['GET'])
# def show_db_data():
# 	class_area = request.form.get('what_class') #requests data from form
# 	class_is = request.form.get('section_chose')
# 	posts = Post.query.filter( Post.class_area == class_area , Post.class_is == class_is) #only pulls up data for classes relevant to user's query
# 	class_id = class_area + class_is
# 	return render_template("checkin.html" , posts = posts, class_area = class_area, class_is = class_is)


@app.route('/check_for_entry', methods=['POST'])
def check_for_entry():
	# do_something_wrong()
	# raise
	# return 'Ohnoes' 		
	class_area = request.form['classArea'] #requests data from form
	class_is = request.form['class_is']
	end = request.form['end']
	t_end = datetime.strptime(end, "%I:%M%p")
	d_end = datetime.now()
	end = d_end.replace(hour = t_end.hour, minute = t_end.minute)	
	print(class_area)
	print(class_is)
	checks =  Post.query.filter( Post.class_area == class_area , Post.class_is == class_is, Post.end > datetime.now())
	i = 0
	for check in checks:
		i += 1
	return str(i)




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