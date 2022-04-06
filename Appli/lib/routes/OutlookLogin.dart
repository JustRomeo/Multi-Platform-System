import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_webview_plugin/flutter_webview_plugin.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import 'package:area/OutlookParser.dart';
import 'package:area/providers/UserInfo.dart';

const URL =
    'https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?client_id=17b92ba4-e055-4e20-a59c-eef5640371fe&response_type=code&redirect_uri=https://login.microsoftonline.com/organizations/oauth2/nativeclient&response_mode=query&scope=openid%20profile%20offline_access%20https://outlook.office.com/Mail.Read%20https://outlook.office.com/Mail.Send%20https://outlook.office.com/Mail.ReadWrite%20https://outlook.office.com/Calendars.ReadWrite&state=12345';

String getToken(String url) {
  if (url == null) {
    return null;
  }
  final int codeBegin = url.indexOf('?code=') + 6;
  final int codeEnd = url.indexOf('&state');

  return url.substring(codeBegin, codeEnd);
}

class OutlookLoginWebPage extends StatefulWidget {
  @override
  _OutlookLoginWebPageState createState() => _OutlookLoginWebPageState();
}

class _OutlookLoginWebPageState extends State<OutlookLoginWebPage> {
  final flutterWebViewPlugin = FlutterWebviewPlugin();
  StreamSubscription<String> _onURLChanged;

  @override
  void initState() {
    super.initState();
    _onURLChanged = flutterWebViewPlugin.onUrlChanged.listen((String url) {
      if (mounted && url.contains('code=') ) {
        Navigator.pop(context, url);
      }
    });
  }

  void dispose() {
    super.dispose();
    _onURLChanged.cancel();
    flutterWebViewPlugin.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WebviewScaffold(
      url: URL,
      appBar: AppBar(title: Text('Connexion à Outlook')),
    );
  }
}

class OutlookLoginButton extends StatelessWidget {
  void saveOutlookService(
      BuildContext context, OutlookTokens tokens, String email) {
    final UserInfo user = Provider.of<UserInfo>(context, listen: false);
    const String apiToken =
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MDNkNjk2N2FiMTFlODFiOTRlNmMxZDAiLCJpYXQiOjE2MTQ2Mzc0ODY5NTcsImV4cCI6MTYxNDYzNzY1OTc1N30.wWoh25nU8tGGIRrsQk6TtiE5JdDvkV4ZarY5m5XA9R8BGldx-gfXtVUe2DInGiJZOYPaf2yg78JBUamAmBdrShHdINHZq3HJLPCSNWcXC9mqafTsxKdeThxg4JydiUFdI6CzndhXcnDgtvOXHAm9kxhlSzky4Nm5KO7KSgkOuqNown-CvkPZZx8ipzW9eNJWmHS2t0Zcx3Rv4aUi3MKD-nZDDR7AVf5dgxqxacVtQCXiA-YRmpuT8M-myrTnY3oT6O1vt-IZfwVb1kiHiLsceUT095e4-vLONDDsPTPLFmRKa8BmTcuhojwMdmnxaSuI-1Nu-zsmsKmenmAPZerNzvjqI9JDavYFR01W1XptDcX23Qtk_2CGY_pcn5ipvNfHalOLw8OOLIwKoZQUnAa1YXAwyVnf2WmI7uVCgaIxnlvEVGmrtJUJ5YHvV3YXndyp7iH2JfHprezTj1suAtkxy8MB0YiYZkwg1MCu9mOe3YvgOwLqyMssQnvxg077oMqzQj5Q6csK18uVQWxO1aa5o2vwujOdkoCjszR8XErnUWupz57WJ0BwA3EUZqeEtm_v3dwZJyAbJrdDgvEb4rLGEAdz7wMG09twLXLljRklrr0dY7Jp9CDXzI6XUjsFz2zSDg8RGBZzZfI9vbKWD-sOUKbjlxDPTQij9FFXfXOxx60';
    final Map<String, String> body = {
      'token': tokens.accessToken,
      'refreshToken': tokens.refreshToken,
      'email': email,
    };
    http.post(
      'https://back-area.herokuapp.com/addOutlookToken',
      headers: {
        "Authorization": user.bearerToken,
        'Content-type': 'application/json'
      },
      body: jsonEncode(body),
    );
  }

  void login(BuildContext context) async {
    final String result = await Navigator.push(context,
        MaterialPageRoute(builder: (context) => OutlookLoginWebPage()));
    final String token = getToken(result);
    final Map<String, String> body = {
      'grant_type': 'authorization_code',
      'client_id': '17b92ba4-e055-4e20-a59c-eef5640371fe',
      'scope':
          'openid profile offline_access https://outlook.office.com/Mail.Read https://outlook.office.com/Mail.Send https://outlook.office.com/Mail.ReadWrite https://outlook.office.com/Calendars.ReadWrite',
      'redirect_uri':
          'https://login.microsoftonline.com/organizations/oauth2/nativeclient',
      'client_secret': '8i435u-YJ5A8efWf3zzq_H_73H_Z9~u~3k',
      'code': token
    };

    final value = await http.post(
      'https://login.microsoftonline.com/organizations/oauth2/v2.0/token',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: body,
    );
    OutlookTokens tokens = OutlookTokens.fromJson(jsonDecode(value.body));
    final email = await http.get('https://outlook.office.com/api/v2.0/me',
        headers: {'Authorization': 'Bearer ' + tokens.accessToken});
    saveOutlookService(context, tokens, jsonDecode(email.body)['EmailAddress']);
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(icon: Icon(Icons.add), onPressed: () => login(context));
  }
}
