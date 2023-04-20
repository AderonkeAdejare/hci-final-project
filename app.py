# Python file for Flask 

import os

from flask import Flask, flash, redirect, render_template, request, session
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.route("/")
#def home():
 #   return "Hello, World!"
def index():
  return render_template("index.html")

@app.route("/instructions.html")
def instructions():
  return render_template("instructions.html")

@app.route("/pause.html")
def pause():
  return render_template("pause.html")

@app.route("/questions.html")
def questions():
  return render_template("questions.html")

@app.route("/results.html")
def results():
  return render_template("results.html")

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