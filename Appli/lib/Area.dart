class AActionList {
  final String name;
  final List<AAction> actions;

  AActionList({this.name, this.actions});

  factory AActionList.fromJson(dynamic json) {
    final jsonActions = json['actions'] as List;
    List<AAction> actions;

    if (jsonActions != null && jsonActions.length > 0) {
      actions = jsonActions
          .map((actionJson) => AAction.fromJson(actionJson))
          .toList();
    }
    return AActionList(
      name: json['name'],
      actions: actions,
    );
  }
}

class AAction {
  final String title;
  final String name;
  final List<String> args;

  AAction({this.title, this.name, this.args});

  factory AAction.fromJson(Map<String, dynamic> json) {
    return AAction(
      title: json['title'] as String,
      name: json['name'] as String,
      args: json['args'] == null ? null : List.from(json['args']),
    );
  }
}

class AReactionList {
  final String name;
  final List<AReaction> reactions;

  AReactionList({this.name, this.reactions});

  factory AReactionList.fromJson(dynamic json) {
    final jsonReactions = json['reactions'] as List;
    List<AReaction> reactions;

    if (jsonReactions != null && jsonReactions.length > 0) {
      reactions = jsonReactions
          .map((reactionJson) => AReaction.fromJson(reactionJson))
          .toList();
    }
    return AReactionList(
      name: json['name'],
      reactions: reactions,
    );
  }
}

class AReaction {
  final String title;
  final String name;
  final List<String> args;

  AReaction({this.title, this.name, this.args});

  factory AReaction.fromJson(Map<String, dynamic> json) {
    return AReaction(
      title: json['title'] as String,
      name: json['name'] as String,
      args: json['args'] == null ? null : List.from(json['args']),
    );
  }
}

class Area {
  String id;
  String actionService;
  String actionTitle;
  String actionName;
  List<String> actionParams;
  List<String> actionParamsValues;
  String reactionService;
  String reactionTitle;
  String reactionName;
  List<String> reactionParams;
  List<String> reactionParamsValues;

  Area.json({
    this.id,
    this.actionService,
    this.reactionService,
    this.actionParamsValues,
    this.reactionParamsValues,
  });

  Area({
    this.actionService,
    this.reactionService,
    this.actionParams,
    this.reactionParams,
    this.actionTitle,
    this.reactionTitle,
  });

  void removeAction() {
    this.actionService = null;
    this.actionTitle = null;
    this.actionName = null;
    this.actionParams = null;
    this.reactionParamsValues = null;
  }

  void removeReaction() {
    this.reactionService = null;
    this.reactionTitle = null;
    this.reactionName = null;
    this.reactionParams = null;
    this.reactionParamsValues = null;
  }

  void addAction(String service, String title, String name, List<String> params,
      List<String> paramsValues) {
    this.actionService = service;
    this.actionTitle = title;
    this.actionName = name;
    this.actionParams = params;
    this.actionParamsValues = paramsValues;
  }

  void addReaction(String service, String title, String name,
      List<String> params, List<String> paramsValues) {
    this.reactionService = service;
    this.reactionTitle = title;
    this.reactionName = name;
    this.reactionParams = params;
    this.reactionParamsValues = paramsValues;
  }

  void addActionArgValue(String value) {
    if (actionParamsValues == null) {
      actionParamsValues = [value];
      return;
    }
    if (actionParamsValues[0] != value) {
      actionParamsValues.insert(0, actionName);
    }
  }

  void addReactionArgValue(String value) {
    if (reactionParamsValues == null) {
      reactionParamsValues = [value];
      return;
    }
    if (reactionParamsValues[0] != value) {
      reactionParamsValues.insert(0, reactionName);
    }
  }

  factory Area.fromJson(Map<String, dynamic> json) {
    return Area.json(
      id: json['_id'],
      actionService: json['Action'],
      reactionService: json['Reaction'],
      actionParamsValues: List.from(json['ActionParameter']),
      reactionParamsValues: List.from(json['ReactionParameter']),
    );
  }
}
