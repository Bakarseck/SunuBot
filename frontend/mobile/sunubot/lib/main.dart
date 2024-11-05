import 'package:flutter/material.dart';

void main() => runApp(SUNUBOTApp());

class SUNUBOTApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SUNUBOT',
      theme: ThemeData(
        primarySwatch: Colors.orange,
      ),
      home: SUNUBOTInterface(),
    );
  }
}

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
          // Upload Tab
          buildUploadTab(),
          // Record Tab
          buildRecordTab(),
          // Transcribe Tab
          buildTranscribeTab(),
          // Summarize Tab
          buildSummarizeTab(),
          // Chat Tab
          buildChatTab(),
        ],
      ),
    );
  }

  Widget buildUploadTab() {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        children: [
          TextField(
            decoration: InputDecoration(
              labelText: 'Entrez votre texte ici...',
              border: OutlineInputBorder(),
            ),
            onChanged: (value) {
              setState(() {
                hasContent = value.isNotEmpty;
              });
            },
          ),
          SizedBox(height: 16),
          ElevatedButton(
            onPressed: hasContent ? handleTranscribe : null,
            child: Text("Traiter le contenu"),
          ),
        ],
      ),
    );
  }

  Widget buildRecordTab() {
    return Center(
      child: ElevatedButton(
        onPressed: () {
          setState(() {
            isRecording = !isRecording;
          });
        },
        child: Text(isRecording ? 'Arrêter l\'enregistrement' : 'Démarrer l\'enregistrement'),
        style: ElevatedButton.styleFrom(primary: isRecording ? Colors.red : Colors.green),
      ),
    );
  }

  Widget buildTranscribeTab() {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        children: [
          Text("Transcription", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          TextField(
            maxLines: 5,
            readOnly: true,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
            ),
            controller: TextEditingController(text: transcription),
          ),
          SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              // Add download logic
            },
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.download),
                SizedBox(width: 8),
                Text("Télécharger"),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget buildSummarizeTab() {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        children: [
          Text("Résumé", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          TextField(
            maxLines: 5,
            readOnly: true,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
            ),
            controller: TextEditingController(text: summary),
          ),
          SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              setState(() {
                summary = "Résumé du contenu...";
              });
            },
            child: Text("Générer le résumé"),
          ),
        ],
      ),
    );
  }

  Widget buildChatTab() {
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
            onSubmitted: (value) {
              handleSendMessage(value);
            },
          ),
        ],
      ),
    );
  }

  void handleTranscribe() {
    setState(() {
      transcription = "Transcription du texte saisi...";
    });
  }
}
