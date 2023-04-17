# Python file for Flask 

import os

from flask import Flask
# from flask import Flask, flash, redirect, render_template, request, session

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.route("/")
def home():
    return "Hello, World!"
#def index():
 #   return render_template("index.html")
