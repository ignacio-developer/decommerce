<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset Code</title>
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
            width: 40%;
            margin: auto;
            padding: 20px;
            border-radius: 1rem;
            background-color: rgba(0, 0, 0, 0.8);
            color: #e0e0e0;
            background-image: url('https://i.postimg.cc/FKXbpVz5/360-F-106047095-a33b-OMz91oq-IVj-Cq-O2-Vk-GLDNM939-ODpp-1.jpg');
            background-size: auto;
            background-repeat: no-repeat;
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
            text-align: center;
            font-family: 'Times New Roman', 'Georgia', serif;
            margin: 0;
            color: #7fad39;
            font-size: 2rem;
        }
        .header h2 {
            text-align: center;
            font-family: 'Times New Roman', 'Georgia', serif;
            margin: 0;
            color: #f9a825;
            font-size: 2rem;
        }
        .content p {
            text-align: center;
            margin: 10px 0;
            color: #ccc;
        }
        .centered-text {
            text-align: center;
            margin-top: 20px;
            font-size: 1.5em;
            color: #f9a825;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #7fad39;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Fruitify</h1>
        <h2>Password Reset Code</h2>
    </div>
    <div class="content">
        <p>Dear <strong>{{ $userName }}</strong>,</p>
        <p>Your password reset code is: <strong>{{ $resetCode }}</strong></p>
        <p>If you did not request this reset, please ignore this email.</p>
    </div>
    <div class="footer">
        <p>&copy; 2024 Fruitify. All rights reserved.</p>
    </div>
</div>
</body>
</html>
