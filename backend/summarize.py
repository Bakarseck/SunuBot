
import openai


def summerize(texte):
    # Envoyer une requête à l'API pour générer un résumé
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # ou 'gpt-4' si disponible
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes text."},
            {"role": "user", "content": f"Résumé ce texte : {texte}"}
        ]
    )
    # Retourner le résumé obtenu
    return response.choices[0].message['content']