import 'package:flutter/material.dart';

class ChatTab extends StatelessWidget {
  final List<String> chatMessages;
  final Function(String) handleSendMessage;

  ChatTab({required this.chatMessages, required this.handleSendMessage});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: chatMessages.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(chatMessages[index]),
                );
              },
            ),
          ),
          TextField(
            decoration: InputDecoration(
              labelText: 'Posez une question sur le contenu...',
              border: OutlineInputBorder(),
            ),
            onSubmitted: handleSendMessage,
          ),
        ],
      ),
    );
  }
}
