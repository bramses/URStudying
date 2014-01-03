#Imports. Using Flask and subdependencies. Using SQLAlchemy for the database, and Jinja for template rendering 
from flask import Flask, jsonify, render_template, request, g, flash, redirect,url_for, session,escape
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager, login_user, logout_user, current_user, login_required
from datetime import datetime
from flask.ext.wtf import Form
from wtforms import TextField, BooleanField
from wtforms.validators import Required



app = Flask(__name__) #the app initializer


app.config.from_object('config') #retrieves db data from the config.py file

db = SQLAlchemy(app) #database for URStudy

#------------------------------secret key here -- only for me ;)-------------------------------------



@app.route('/')#route to the home page (index.html)
def initialize(): #initialization function for index.html, renders homepage
    return render_template("index.html") 

@app.route('/FAQ')
def faq_page():
	return render_template("FAQ.html")

@app.route('/checkin', methods=['GET','POST']) #renders check in page (the one with the DB) by using arguments given from index.html
def checkinpage():
	if request.method == 'POST':
		author = request.form.get('author')
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

	 	session['username'] = author
	 	print(session['username'])
	 	

	 	post = Post(class_area = class_area, class_is = class_is, how_many = how_many, study_area = study_area, pub_date = the_start, end =the_end, body_notes =  body_notes) #finally, adds to database
	 	d_u = User.query.filter_by(fullname = author).first()
	 	if d_u is None:		
	 		u = User(fullname = author)
	 		u.posts.append(post)
	 		db.session.add(u)
	 	else:
	 		d_u.posts.append(post)

	 	duplicate_check = Post.query.filter_by( class_area  = class_area ,class_is = class_is ,body_notes = body_notes).first()

	 	
	 	if(duplicate_check is None):
			db.session.add(post)
			db.session.commit()
		elif(post.body_notes != duplicate_check.body_notes):
			db.session.add(u)
			db.session.add(post)
			db.session.commit() #commits to db
		
		class_id = class_area + class_is 

		posts = Post.query.filter( Post.class_area == class_area , Post.class_is == class_is ,Post.end > datetime.now()) #only pulls up data for classes relevant to user's query


		#uncomment this to see debug log
		
		
		# do_something_wrong()
		# raise
		# return 'Ohnoes' 	
		
		return render_template("successful_entry.html", study_area = study_area) 
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
		'''

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

@app.route('/add_session', methods=['POST'])
def add_to_session():
	author = request.form.get('author')
	session['username'] = author
	return render_template('index.html')


@app.route('/edit_posts', methods=['GET'])
def edit_me():
	if 'username' in session:
		u = User.query.filter_by(fullname = escape(session['username']) ).first()
		print("count is:")
		print(u.posts.count())
		print(u.posts.filter(Post.end > datetime.now()).count())
		posts = u.posts.filter(Post.end > datetime.now())
		return render_template("edit.html", posts = posts, user_name = escape(session['username']))
	return render_template("no_session.html")


@app.route('/update_post', methods=['POST'])
def update_entry():
	updated_how_many = request.form.get('how_many')
	if updated_how_many is not None and updated_how_many != "0":
		u = User.query.filter_by(fullname = escape(session['username']) ).first() #change once I get relational DB working. Right now just retreives first. Will retreive the one user is editing later. Going off assumption user will only have one group at a time anyway
		print(u)
		posts = u.posts
		print(u.posts.count())
		p_id = posts.first().id
		print(posts.first().how_many)
		post_update = Post.query.get(p_id)
		post_update.how_many = updated_how_many #check for 0 case
		db.session.commit()

	del_post = request.form.get('delete')
	print(del_post)
	if del_post == "true":
		u = User.query.filter_by(fullname = escape(session['username']) ).first()
		posts = u.posts
		p_id = posts.first().id
		post_update = Post.query.get(p_id)
		

		db.session.delete(post_update)
		db.session.commit()

	else:
		print('nah srry yo')
	
	return 'Added to db!'



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
	return str(checks.count())




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
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    #user = db.relationship('User', backref = db.backref('posts', lazy = 'dynamic'))

    #initializes the DB posts one by one -- switched over to explicit declaration model
    # def __init__(self, class_area, class_is, how_many, study_area, pub_date, end, body_notes,user):
      
    #     self.class_area = class_area
    #     self.class_is = class_is
    #     self.how_many = how_many
    #     self.study_area = study_area
    #     if pub_date is None:
    #         pub_date = datetime.utcnow()
    #     self.pub_date = pub_date
    #     self.end = end
    #     self.body_notes = body_notes
    #     self.user = user
       
    
    def __repr__(self):
        return '<Post %r>' % self.end


class User(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	fullname = db.Column(db.String(120))
	posts = db.relationship('Post', backref = 'posts', lazy = 'dynamic')

	# def __init__(self, fullname):
	# 	self.fullname = fullname


	def is_authenticated(self):
		return True

	def is_active(self):
		return True

	def is_anonymous(self):
		return False

	def get_id(self):
		return unicode(self.id)

	def __repr__(self):
    		return '<User %r>' % self.fullname

#runs the program
if __name__ == '__main__':
	app.run(debug = True)