<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: 'Times New Roman', 'Georgia', serif;
            line-height: 1.6;
            background-size: cover;
            background-position: center;
            color: #e0e0e0;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 50%;
            margin: auto;
            padding: 20px;
            border-radius: 1rem;
            background-color: rgba(51, 51, 51, 0.8); /* Semi-transparent background for contrast */
            color: #e0e0e0;
            background-image: url('https://i.postimg.cc/FKXbpVz5/360-F-106047095-a33b-OMz91oq-IVj-Cq-O2-Vk-GLDNM939-ODpp-1.jpg');
            background-size: cover;
            background-position: center;
            position: relative;
            overflow: hidden;
        }
        .container::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: inherit;
            filter: blur(15px); /* Adjust the blur radius as needed */
            z-index: -1; /* Send the blur effect behind the content */
        }
        .header {
            text-align: left;
            padding-bottom: 20px;
        }
        .header h1 {
            font-family: 'Times New Roman', 'Georgia', serif;
            margin: 0;
            color: #7fad39;
            font-size: 2rem;
        }
        .header h2 {
            font-family: 'Times New Roman', 'Georgia', serif;
            margin: 0;
            color: #f9a825;
            font-size: 2rem;
        }
        .content p {
            margin: 10px 0;
            color: #ccc;
        }
        .product-list {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
        }
        .product-list th, .product-list td {
            border: 1px solid #555;
            padding: 12px;
            text-align: left;
        }
        .product-list th {
            background-color: #444;
            color: #f9a825;
        }
        .centered-text {
            text-align: center;
            margin-top: 20px;
            font-size: 1.5em;
            color: #f9a825;
        }
        .centered-text h2{
            font-family: 'Times New Roman', 'Georgia', serif;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #7fad39;
        }
        .total-price {
            font-weight: bold;
            text-align: right;
            padding-right: 20px;
        }
        .total-price td {
            color: #f9a825;
        }
        .price-on-sale {
            color: #f44336; /* Red color for sale price */
            text-decoration: line-through; /* Strikethrough for original price */
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Fruitify</h1>
        <h2>Order Confirmation</h2>
    </div>
    <div class="content">
        <p>Dear <strong>{{ $deliveryInfo['name'] }}</strong>,</p>
        <p>Your order has been successfully placed!</p>
        @if ($deliveryInfo['delivery_type'] === 'econt_office')
            <p><strong>Delivery to Econt Office:</strong> {{ $deliveryInfo['econt_office'] }}</p>
        @else
            <p><strong>Delivery to Address:</strong> {{ $deliveryInfo['address'] }}</p>
        @endif
        <p><strong>Phone:</strong> {{ $deliveryInfo['phone'] }}</p>
        <div class="centered-text">
            <h2>Purchased Products</h2>
        </div>
        <table class="product-list">
            <thead>
            <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>
            @foreach($products as $product)
                <tr>
                    <td>{{ $product['name'] }}</td>
                    <td>{{ $product['quantity'] }}</td>
                    <td>
                        @if(isset($product['on_sale']) && $product['on_sale'])
                            <span class="price-on-sale">${{ $product['price'] }}</span>
                            <span>${{ $product['on_sale_price'] }}</span>
                        @else
                            ${{ $product['price'] * $product['quantity'] }}

                        @endif
                    </td>
                </tr>
            @endforeach
            </tbody>
            <tfoot>
            <tr>
                <td colspan="2" class="total-price">Discount:</td>
                <td class="total-price">${{ $deliveryInfo['discount'] }}</td>
            </tr>
            <tr>
                <td colspan="2" class="total-price">Total Price:</td>
                <td class="total-price">${{ $totalPrice - $deliveryInfo['discount'] }}</td>
            </tr>
            </tfoot>
        </table>
        <div class="centered-text">
            <p>We're grateful for your trust in us. Thanks for your order!</p>
        </div>
    </div>
    <div class="footer">
        <p>&copy; 2024 Fruitify. All rights reserved.</p>
    </div>
</div>
</body>
</html>
