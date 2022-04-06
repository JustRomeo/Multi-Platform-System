class OutlookTokens {
  final String accessToken;
  final String refreshToken;
  final String idToken;

  OutlookTokens({this.accessToken, this.refreshToken, this.idToken});

  factory OutlookTokens.fromJson(Map<String, dynamic> json) {
    return OutlookTokens(
      accessToken: json['access_token'],
      refreshToken: json['refresh_token'],
      idToken: json['id_token'],
    );
  }
}
