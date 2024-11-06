import 'package:flutter/material.dart';
import 'package:dio/dio.dart'; // Pour gérer les requêtes API et FormData
import 'package:file_picker/file_picker.dart'; // Pour sélectionner les fichiers

void main() {
  runApp(SunubotApp());
}

class SunubotApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.light(),
      home: SunubotInterface(),
    );
  }
}

class SunubotInterface extends StatefulWidget {
  @override
  _SunubotInterfaceState createState() => _SunubotInterfaceState();
}

class _SunubotInterfaceState extends State<SunubotInterface> {
  int _selectedTab = 0;
  String inputText = "";
  String summary = "";
  bool loading = false;
  FilePickerResult? fileResult;
  Dio dio = Dio();

  Future<void> handleTextSubmit() async {
    if (inputText.trim().isEmpty) return;

    setState(() {
      loading = true;
    });

    try {
      final formData = FormData.fromMap({
        "file": MultipartFile.fromBytes(inputText.codeUnits, filename: "text_input.txt"),
      });

      final response = await dio.post(
        "http://0.0.0.0:8000/model/upload/",
        data: formData,
      );

      setState(() {
        summary = response.data["summarized_text"];
      });
    } catch (error) {
      print("Error sending text to API: $error");
    } finally {
      setState(() {
        loading = false;
        inputText = "";
      });
    }
  }

  Future<void> handleFileUpload() async {
    final result = await FilePicker.platform.pickFiles();

    if (result != null) {
      setState(() {
        fileResult = result;
        loading = true;
      });

      try {
        final file = result.files.single;
        final formData = FormData.fromMap({
          "file": MultipartFile.fromBytes(file.bytes!, filename: file.name),
        });

        final response = await dio.post(
          "http://0.0.0.0:8000/model/upload/",
          data: formData,
        );

        setState(() {
          summary = response.data["summarized_text"];
        });
      } catch (error) {
        print("Error uploading file: $error");
      } finally {
        setState(() {
          loading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Image.asset('assets/sunubot_logo.png', height: 40), // Assurez-vous que l'image est ajoutée dans les assets
            SizedBox(width: 8),
            Text("Sunubot"),
          ],
        ),
        backgroundColor: Colors.pinkAccent,
      ),
      body: Column(
        children: [
          TabBar(
            onTap: (index) => setState(() => _selectedTab = index),
            tabs: [
              Tab(text: "Texte"),
              Tab(text: "Fichier"),
              Tab(text: "Enregistrer"),
            ],
          ),
          Expanded(
            child: _selectedTab == 0
                ? buildTextTab()
                : _selectedTab == 1
                    ? buildFileTab()
                    : buildRecordTab(),
          ),
        ],
      ),
    );
  }

  Widget buildTextTab() {
    return Column(
      children: [
        Expanded(
          child: loading
              ? Center(child: CircularProgressIndicator())
              : Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text(summary.isEmpty
                      ? "Entrez votre texte pour obtenir un résumé."
                      : "Voici votre résumé : $summary"),
                ),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  decoration: InputDecoration(hintText: "Entrez votre texte ici"),
                  onChanged: (value) => setState(() => inputText = value),
                ),
              ),
              IconButton(
                icon: Icon(Icons.send),
                onPressed: handleTextSubmit,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget buildFileTab() {
    return Column(
      children: [
        Expanded(
          child: loading
              ? Center(child: CircularProgressIndicator())
              : Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text(summary.isEmpty
                      ? "Veuillez uploader un fichier pour obtenir un résumé."
                      : "Voici votre résumé : $summary"),
                ),
        ),
        ElevatedButton.icon(
          icon: Icon(Icons.upload_file),
          label: Text("Uploader un fichier"),
          onPressed: handleFileUpload,
        ),
      ],
    );
  }

  Widget buildRecordTab() {
    return Center(
      child: ElevatedButton.icon(
        icon: Icon(Icons.mic),
        label: Text("Enregistrer"),
        onPressed: () {
          // Enregistrement audio à implémenter
        },
      ),
    );
  }
}
