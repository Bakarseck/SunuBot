import openai

def summerize(texte):
    # Envoyer une requête à l'API pour générer un résumé
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes text."},
            {"role": "user", "content": f"Résumé ce texte : {texte}"}
        ]
    )
    # Retourner le résumé obtenu
    return response.choices[0].message['content']
