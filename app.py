from flask import Flask, request, render_template, redirect, url_for, session, g, jsonify
import sqlite3

app = Flask(__name__)
app.secret_key = 'fthydtukfl'


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect('minecraft_store.db')
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
    '''testing id'''
    session['id'] = 123
    return render_template('index.html')

@app.route('/shop')
def shop():
    conn = get_db()
    products = conn.execute('SELECT * FROM products').fetchall()
    products_list = [dict(product) for product in products]
    fav_list = []
    if(session.get('username')):
        fav = conn.execute('SELECT * FROM favourite WHERE username = ?', (session.get('username'),)).fetchall()
        dummy = [dict(f) for f in fav]
        fav_list = [int(f['product']) for f in dummy]
    for item in products_list:
        if item.get('id') in fav_list:
            item['fav'] = True
        else:
            item['fav'] = False
    print(products_list)
    conn.close()
    return render_template('shop.html',products_list = products_list)

@app.route('/cart')
def cart():
    cart = session.get('cart', [])
    conn = get_db()
    products = conn.execute('SELECT * FROM products').fetchall()
    products_list = [dict(product) for product in products]
    if(session.get('username')):
        fav = conn.execute('SELECT * FROM cart WHERE username = ?', (session.get('username'),)).fetchall()
        cartProducts = [dict(f) for f in fav]
        for item in cartProducts:
            for product in products_list:
                if item['product_id'] == product['id']:
                    item['name'] = product['name']
                    item['price'] = product['price']
                    item['storage'] = product['storage']
                    item['img'] = './static/img/'+product['image']
        conn.close()
        return render_template('cart.html', cart=cartProducts)
    else:
        return render_template('cart.html')



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

@app.route('/admin')
def admin():
    return render_template('admin.html')


@app.route('/api/shop')
def get_products_data():
    conn = get_db()
    products = conn.execute('SELECT * FROM products').fetchall()
    conn.close()
    products_list = [dict(product) for product in products]
    return jsonify(products_list)

@app.route('/api/fav')
def get_favorite_data():
    conn = get_db()
    fav = conn.execute('SELECT * FROM favourite WHERE username = ?', (session.get('username'),)).fetchall()
    conn.close()
    dummy = [dict(f) for f in fav]
    fav_list = [int(f['product']) for f in dummy]
    # print(fav_list)
    return jsonify(fav_list)

@app.route('/api/add_cart', methods=['POST'])
def add_cart():
    product_id = request.json.get('data')
    if product_id is not None:
        try:
            conn = get_db()
            exist = conn.execute('SELECT * FROM cart WHERE username = ? AND product_id = ?',(session.get('username'),int(product_id)))
            dummy = [dict(f) for f in exist]
            # print(dummy)
            if dummy:
                # alert
                conn.commit()
                conn.close()
                return jsonify(success=False)
            else:
                conn.execute('INSERT INTO cart (product_id, amount, username) VALUES (?, ?, ?)', (int(product_id), 1, session.get('username')))
                conn.commit()
                conn.close()
                return jsonify(success=True)
        except Exception as e:
            print(f"Error : {e}")
            return jsonify(success=False, erorr="No data prodived")
        
@app.route('/api/add_fav', methods=['POST'])
def add_fav():
    product_id = request.json.get('data')
    if product_id is not None:
        try:
            conn = get_db()
            conn.execute('INSERT INTO favourite (username, product) VALUES (?, ?)', (session.get('username'), int(product_id)))
            conn.commit()
            conn.close()
            return jsonify(success=True)
        except Exception as e:
            print(f"Error : {e}")
            return jsonify(success=False, erorr="No data prodived")
        
@app.route('/api/remove_fav', methods=['POST'])
def remove_fav():
    product_id = request.json.get('data')
    if product_id is not None:
        try:
            conn = get_db()
            conn.execute('DELETE FROM favourite WHERE username = ? AND product = ?', (session.get('username'), int(product_id)))
            conn.commit()
            conn.close()
            return jsonify(success=True)
        except Exception as e:
            print(f"Error : {e}")
            return jsonify(success=False, erorr="No data prodived")
        
@app.route('/api/remove_cart', methods=['POST'])
def remove_cart():
    product_id = request.json.get('id')
    print(product_id)

    username = session.get('username')
    if product_id is not None and username is not None:
        try:
            conn = get_db()
            conn.execute('DELETE FROM cart WHERE username = ? AND product_id = ?', (username, int(product_id)))
            conn.commit()
            conn.close()
            return jsonify(success=True)
        except Exception as e:
            print(f"Error: {e}")
            return jsonify(success=False, error="Failed to remove the item from the cart")
    return jsonify(success=False, error="No data provided")


@app.route('/api/add_amount', methods=['POST'])
def add_amount():
    product_id = request.json.get('id')
    username = session.get('username')
    new_amount = request.json.get('add')
    
    if product_id is not None and username is not None:
        try:
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute('UPDATE cart SET amount = ? WHERE username = ? AND product_id = ?', (new_amount, username, product_id))
            conn.commit()
            cursor.close()
            return jsonify(success=True)
        except Exception as e:
            print(f"Error: {e}")
            return jsonify(success=False, error="Failed to update the amount")
    return jsonify(success=False, error="No data provided")

@app.route('/api/checkout', methods=['POST'])
def checkout():
    items = request.json.get('items')
    username = session.get('username')

    if not items or not username:
        return jsonify(success=False, error="Invalid data provided")

    try:
        conn = get_db()
        cursor = conn.cursor()
        
        for item in items:
            product_id = item['id']
            quantity = item['quantity']

            # 更新庫存數量
            cursor.execute('UPDATE products SET storage = storage - ? WHERE id = ?', (quantity, product_id))

            # 從購物車中移除已購買的項目
            cursor.execute('DELETE FROM cart WHERE username = ? AND product_id = ?', (username, product_id))
        
        conn.commit()
        cursor.close()
        return jsonify(success=True)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify(success=False, error="Failed to process checkout")



if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
