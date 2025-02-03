<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />

    <style type="text/css">
        a:hover {
            text-decoration: underline !important;
        }
        .header {
            color: #1e1e2d;
            font-weight: 500;
            font-size: 32px;
            font-family: 'Rubik', sans-serif;
            margin: 10px 0px 10px 0px;
            margin: 0;
        }
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f7f6f2;" leftmargin="0">
<!--100% body table-->
<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f7f6f2"
       style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
    <tr>
        <td>
            <table style="background-color: #f7f6f2; max-width:670px;  margin:0 auto;" width="100%" border="0"
                   align="center" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="height:80px;">&nbsp;</td>
                </tr>

                <tr>
                    <td style="height:20px;">&nbsp;</td>
                </tr>
                <tr>
                    <td>
                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                               style="max-width:670px;background:#665e5e; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                            <tr>
                                <td style="height:40px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="padding:0 35px;">
                                    <h1 class="header">Контактна форма</h1>
                                    <p style="color:#ffffff; font-size:15px;line-height:24px; margin:0; text-align: center">
                                        <strong>Име</strong><br> {{ $data['name']}}<br>
                                    </p>
                                    <p style="color:#ffffff; font-size:15px;line-height:24px; margin:0; text-align: center">
                                        <strong>Имейл адрес</strong><br> {{ $data['email']}}<br>
                                    </p>
                                    <p style="color:#ffffff; font-size:15px;line-height:24px; margin:0; text-align: center">
                                        <strong>Съобщение</strong><br> {{ $data['message']}}
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:40px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                <tr>
                    <td style="height:20px;">&nbsp;</td>
                </tr>
                <tr>
                    <td style="height:80px;">&nbsp;</td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<!--/100% body table-->
</body>

</html>
