from flask import Flask, request, render_template, redirect, url_for, session, g, jsonify
import sqlite3

app = Flask(__name__)
app.secret_key = 'fthydtukfl'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect('minecraft_store.db')
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/')
def index():
    return render_template('index.html', username=session.get('username'))

@app.route('/shop')
def shop():
    return render_template('shop.html')

@app.route('/cart')
def cart():
    cart = session.get('cart', [])
    return render_template('cart.html', cart=cart)

@app.route('/login', methods=['GET'])
def login():
    return render_template('log_in.html')

@app.route('/login', methods=['POST'])
def login_post():
    error_message = handle_login(request.form)
    if error_message:
        return render_template('log_in.html', error_message=error_message)
    return redirect(url_for('index'))

def handle_login(form):
    username = form.get('username')
    password = form.get('password')
    cursor = get_db().cursor()
    cursor.execute('SELECT * FROM users WHERE name=? AND password=?', (username, password))
    user = cursor.fetchone()
    if user:
        session['username'] = username
        return None
    else:
        return 'Invalid username or password'

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

@app.route('/signup')
def signup():
    return render_template('sign_up.html')

@app.route('/signup', methods=['POST'])
def signup_post():
    username = request.form.get('username')
    password = request.form.get('password')
    email = request.form.get('email')

    error_user = None
    error_pwd = None
    error_mail = None

    # 檢查密碼是否符合要求
    if len(password) < 8:
        error_pwd = 'Password must be at least 8 characters long'
    elif not any(char.isupper() for char in password):
        error_pwd = 'Password must contain at least one uppercase letter'
    elif not any(char.islower() for char in password):
        error_pwd = 'Password must contain at least one lowercase letter'
    elif not any(char in '@$!%*?&' for char in password):
        error_pwd = 'Password must contain at least one special character'
    elif not email.endswith('@gmail.com'):
        error_mail = 'Email must be a valid Gmail address (XXX@gmail.com)'
    else:
        cursor = get_db().cursor()
        cursor.execute('SELECT * FROM users WHERE name=?', (username,))
        user = cursor.fetchone()
        if user:
            error_user = 'Username already exists'
        else:
            cursor.execute('INSERT INTO users (name, password, mail) VALUES (?, ?, ?)', (username, password, email))
            get_db().commit()
            return redirect(url_for('login'))
    return render_template('sign_up.html', error_pwd=error_pwd, error_mail=error_mail, error_user=error_user)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    product = request.get_json()
    cart = session.get('cart', [])
    cart.append(product)
    session['cart'] = cart
    return jsonify({'message': 'Product added to cart', 'cart': cart})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
