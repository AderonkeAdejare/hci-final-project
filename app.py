# Python file for Flask 
import os
import time

from flask import Flask, flash, redirect, render_template, request, session
import random

# Configure application
app = Flask(__name__)
app._static_folder = os.path.abspath("static/")
app.secret_key = 'your_secret_key'


# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.route("/")
def index():
      session.clear()
      return render_template("index.html")

@app.route("/instructions")
def instructions():
      return render_template("instructions.html")

@app.route("/pause")
def pause():
      return render_template("pause.html")

@app.route("/questions")
def questions():
      return render_template("questions.html")

@app.route("/results")
def results():
    # get selection from URL parameter
    selection = request.args.get('selection')
    option = ["A", "B", "C"]
    index = random.randint(0, 2)

    # Parse selection to determine fan type
    numA = selection.count('A')
    numB = selection.count('B')
    numC = selection.count('C')
    if numA >= numB and numA >= numC:
        fantype = "instrumental music" ##'A'
    elif numB >= numC and numB >= numA:
        fantype = "pop music" ##'B'
    elif numC >= numA and numC >= numB:
        fantype = "hard rock" ##c
    else:
        fantype = option[index]

    ##matbe use session, session
    fans = session.get('fans', [])
    fans.append(fantype)
    session['fans'] = fans 

    count = fans.count(fantype)

    # fans.append(fantype)
    # count = fans.count(fantype)

    return render_template('results.html', count=count, placeholder=fantype)






"""
def errorhandler(e):
    # handle errors
    if not isinstance(e, HTTPException):
        e = InternalServerError()
    return error(e.name, e.code)

# Listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)
 """
if __name__ == '__main__':
    app.run()