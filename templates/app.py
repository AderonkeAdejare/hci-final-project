from flask import Flask, flash, jsonify, redirect, request, session, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quiz.db'
db = SQLAlchemy(app)


##questions.html, the question head with numbers appear
## Maybe Ronke figure out how to change ## number here
@app.route('/quesitons')
def QuestionNum():
    head_embed='Question #'
    # look inside `templates` and serve `index.html`
    return render_template('questions.html', head_embed=head_embed)

@app.route('/quesitons')
def QuestionText():
    text_embed='TEXT'
    # look inside `templates` and serve `index.html`
    return render_template('questions.html', text_embed=text_embed)




## store users' selection in sql database
class Player(db.model):
    id = db.Column(db.Integer, primary_key=True)
    selections = db.relationship('UserSelection', backref='user', lazy=True)


class Answer(db.Model): 
    id = db.Column(db.Integer, primary_key=True) 
    questionNum = db.Column(db.Integer)

class PlayerSelection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    playerID = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    questionID = db.Column(db.Integer, db.ForeignKey('answer.id'), nullable=False)
    selectedRect = db.Column(db.Integer)


@app.route('/api/insertgetInput', methods=["GET", "POST"]) 
def insertgetInput():  
    if request.method =="POST":
        data = request.json
        player_id= data.get("playerId")
        selections = data.get("selections")

        player=Player.query.get(player_id)
        if not player:
            player = Player(id=player_id)
            db.session.add(player)
            db.session.commit()
        
        for selection in selections:
            question_id=selection.get("questionID")
            selected_rect = selection.get("selectedRect")

            player_selection = PlayerSelection(player_id=player_id, question_id=question_id, selected_rect=selected_rect)
            db.session.add(player_selection)
        db.session.commit()
        return {'success': True}


@app.routte('/results')
def show_results():
    latest_player = Player.query.order_by(Player.id.desc()).first()
    latest_selection = latest_player.selections[-1].selected_rect
    if latest_selection == 1:
        result = "pop"
    else:
        result = "rock"
    count = PlayerSelection.query.filter_by(selected_rect=latest_selection).count()
    return render_template('results.html', genre=result, count=count)


if __name__ == '__main__':
    app.run()
