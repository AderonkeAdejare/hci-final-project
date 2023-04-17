from flask import Flask, flash, jsonify, redirect, request, session, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quiz.db'
db = SQLAlchemy(app)


##questions.html, the question head with numbers appear
## Maybe Ronke figure out how to change ## number here
@app.route('/')
def QuestionNum():
    head_embed='Question #'
    # look inside `templates` and serve `index.html`
    return render_template('questions.html', embed=head_embed)


## store users' selection in sql database
class player(db.model):
    id = db.Column(db.Integer, primary_key=True)

class Answer(db.Model): 
    id = db.Column(db.Integer, primary_key=True) 
    selected_rect = db.Column(db.Integer)


@app.route('/api/insertgetInput', methods=["GET", "POST"]) 
def insertgetInput():  
    if request.method =="POST":
        data = request.json
        userId = data.get("userId")
        selection = Answer(selected_rect = data["selectedRect"])
        db.session.add(selection)
        db.session.commit()
        return {'sucess': True}
    else: 
        answers= Answer.query.all()
        result = None
        count = len(answers)
        if answers[-1].selected_react == 1:
            result = "pop"
        else:
            result = "rock"
        return render_template("results.html", result=result, genre=result, count=count)


if __name__ == '__main__':
    app.run()
