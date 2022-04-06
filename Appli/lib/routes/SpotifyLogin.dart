import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_webview_plugin/flutter_webview_plugin.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import 'package:area/providers/UserInfo.dart';

final CBURL = 'http://localhost:8080/service/addService/spotify/callback';

final URL =
    'https://accounts.spotify.com/authorize?client_id=d076e2ef298c4befa44db7828c6e7f49&response_type=code&redirect_uri=' +
        CBURL +
        '&scope=user-follow-read user-read-email playlist-read-private';

String getCode(String url) {
  return url.substring(url.indexOf('code=') + 5);
}

class SpotifyLoginWebPage extends StatefulWidget {
  @override
  _SpotifyLoginWebPageState createState() => _SpotifyLoginWebPageState();
}

class _SpotifyLoginWebPageState extends State<SpotifyLoginWebPage> {
  final flutterWebViewPlugin = FlutterWebviewPlugin();
  StreamSubscription<String> _onURLChanged;

  @override
  void initState() {
    super.initState();
    _onURLChanged = flutterWebViewPlugin.onUrlChanged.listen((String url) {
      if (mounted && url.contains('code=')) {
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
      appBar: AppBar(title: Text('Connexion à Spotify')),
    );
  }
}

class SpotifyLoginButton extends StatelessWidget {
  getEmail(String token) async {
    if (token == null || token.length == 0) {
      return '';
    }
    final result = await http.get('https://api.spotify.com/v1/me',
        headers: {'Authorization': 'Bearer ' + token});
    return jsonDecode(result.body)['email'];
  }

  void login(BuildContext context) async {
    final UserInfo user = Provider.of<UserInfo>(context, listen: false);
    server();
    final String url = await Navigator.push(context,
        MaterialPageRoute(builder: (context) => SpotifyLoginWebPage()));
    final Map<String, String> body = {
      'grant_type': 'authorization_code',
      'code': getCode(url),
      'redirect_uri': CBURL,
      'client_id': 'd076e2ef298c4befa44db7828c6e7f49',
      'client_secret': '22aff2c6a6d24499837e2b9311f70e22',
    };
    final result =
        await http.post('https://accounts.spotify.com/api/token', body: body);
    final String accessToken = jsonDecode(result.body)['access_token'];
    final String email = await getEmail(accessToken);
    http.post('https://back-area.herokuapp.com/addSpotifyToken', headers: {
      'Authorization': user.bearerToken,
    }, body: {
      'token': accessToken,
      'refreshToken': jsonDecode(result.body)['refresh_token'],
      'email': email
    }).then((value) => print(value.body));
    final goodSnackBar = SnackBar(content: Text("Vous êtes à présent connecté au service Spotify 😃"));
    Scaffold.of(context).showSnackBar(goodSnackBar);
    Navigator.pushNamed(context, '/services');
  }

  void server() async {
    HttpServer server =
        await HttpServer.bind(InternetAddress.loopbackIPv4, 8080);
    server.listen((HttpRequest request) async {
      request.response
        ..statusCode = 200
        ..headers.set('Content-Type', ContentType.html.mimeType)
        ..write('<html></html>');
      await request.response.close();
      await server.close();
    });
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(icon: Icon(Icons.add), onPressed: () => login(context));
  }
}
