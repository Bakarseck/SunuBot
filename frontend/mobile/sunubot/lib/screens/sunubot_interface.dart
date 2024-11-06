import 'package:flutter/material.dart';
import 'upload_tab.dart';
import 'record_tab.dart';
import 'transcribe_tab.dart';
import 'summarize_tab.dart';
import 'chat_tab.dart';

class SUNUBOTInterface extends StatefulWidget {
  @override
  _SUNUBOTInterfaceState createState() => _SUNUBOTInterfaceState();
}

class _SUNUBOTInterfaceState extends State<SUNUBOTInterface> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool hasContent = false;
  bool isRecording = false;
  String transcription = '';
  String summary = '';
  List<String> chatMessages = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
  }

  void handleSendMessage(String message) {
    setState(() {
      chatMessages.add(message);
    });
  }

  void handleTranscribe() {
    setState(() {
      transcription = "Transcription du texte saisi...";
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('SUNUBOT'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: [
            Tab(text: 'Chargement'),
            Tab(text: 'Enregistrement'),
            Tab(text: 'Transcription'),
            Tab(text: 'Résumé'),
            Tab(text: 'Discussion'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          UploadTab(),
          RecordTab(isRecording: isRecording, toggleRecording: () {
            setState(() {
              isRecording = !isRecording;
            });
          }),
          TranscribeTab(transcription: transcription, handleTranscribe: handleTranscribe),
          SummarizeTab(summary: summary, setSummary: (text) {
            setState(() {
              summary = text;
            });
          }),
          ChatTab(chatMessages: chatMessages, handleSendMessage: handleSendMessage),
        ],
      ),
    );
  }
}
