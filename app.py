from flask import Flask, request, jsonify, render_template, g
import sqlite3

app = Flask(__name__)
app.secret_key = 'fthydtukfl'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect('users.db')
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/shop')
def shop():
    return render_template('shop.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/login')
def login():
    return render_template('log_in.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/about')
def about():
    return render_template('about.html')




if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)