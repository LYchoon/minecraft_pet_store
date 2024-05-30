from flask import Flask, request, jsonify, render_template, g, session, flash
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
    '''testing id'''
    session['id'] = 123
    return render_template('index.html')

@app.route('/shop')
def shop():
    conn = get_db()
    products = conn.execute('SELECT * FROM products').fetchall()
    products_list = [dict(product) for product in products]
    fav_list = []
    if(session.get('id')):
        fav = conn.execute('SELECT * FROM favourite WHERE user = ?', (session.get('id'),)).fetchall()
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
    return render_template('cart.html')

@app.route('/login')
def login():
    return render_template('log_in.html')

@app.route('/signup')
def signup():
    return render_template('sign_up.html')

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
    fav = conn.execute('SELECT * FROM favourite WHERE user = ?', (session.get('id'),)).fetchall()
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
            exist = conn.execute('SELECT * FROM cart WHERE user_id = ? AND product_id = ?',(session.get('id'),int(product_id)))
            dummy = [dict(f) for f in exist]
            # print(dummy)
            if dummy:
                # alert
                conn.commit()
                conn.close()
                return jsonify(success=False)
            else:
                conn.execute('INSERT INTO cart (product_id, amount, user_id) VALUES (?, ?, ?)', (int(product_id), 1, session.get('id')))
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
            conn.execute('INSERT INTO favourite (user, product) VALUES (?, ?)', (session.get('id'), int(product_id)))
            conn.commit()
            conn.close()
            return jsonify(success=True)
        except Exception as e:
            print(f"Error : {e}")
            return jsonify(success=False, erorr="No data prodived")
@app.route('/api/remove_fav',  methods=['POST'])
def remove_fav():
    product_id = request.json.get('data')
    if product_id is not None:
        try:
            conn = get_db()
            conn.execute('DELETE FROM favourite WHERE user = ? AND product = ?', (session.get('id'), int(product_id)))
            conn.commit()
            conn.close()
            return jsonify(success=True)
        except Exception as e:
            print(f"Error : {e}")
            return jsonify(success=False, erorr="No data prodived")

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)