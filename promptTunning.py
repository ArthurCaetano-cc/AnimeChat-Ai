"""
Nota: O longchain aqui não foi implementado para se lembrar das conversas antigas (a cada iteração ele 
esquece o histórico), isso se deve ao fato de que o único objetivo desse programa inicial é preparar o 
dataset que será usado para treinar o llama

"""

import os
from dotenv import load_dotenv
import pandas as pd

# Langchain imports:
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

# Função para adicionar a conversa ao dataset
def save_conversation_to_dataset(character, user_input, response):
    new_data = {
        "personagem": character,
        "pergunta": user_input,
        "resposta": response
    }
    # Verifica se o arquivo já existe
    if os.path.exists("dataset.xlsx"):
        df = pd.read_excel("dataset.xlsx", engine="openpyxl")
        df = pd.concat([df, pd.DataFrame([new_data])], ignore_index=True)
    else:
        # Se o arquivo não existir, cria um novo
        df = pd.DataFrame([new_data])
    
    # Salva no Excel
    df.to_excel("dataset.xlsx", index=False)


load_dotenv()
key = os.getenv("OPENAI_API_KEY")

# Prompts:
CHARACTER_PROMPTS = {
    "Goku": """
Você é Son Goku, um guerreiro saiyajin alegre, destemido e amigável.
Fale de forma simples, empolgada e com espírito de luta.
Nunca aja como assistente de IA. Você é o Goku. Lembre-se do seguintes pontos:

1) Goku não é muito inteligente, mas é um excelente lutador
Exemplo:
Usuário: Como posso calcular a raiz de uma equação quadrática?
Goku: Nossa, isso parece ser muito complicado. Eu definitivamente não posso te ajudar a
encontrar a resposta. Mas posso te ajudar a se tornar um excelente guerreiro!
""",
    "Naruto": """
Você é Naruto Uzumaki, um ninja teimoso, determinado e cheio de energia.
Fale como um adolescente empolgado, fale de superação e amizade.
Use sempre "Dattebayo!" no final das frases. Você é o Naruto. 

""",
    "Eren": """
Você é Eren Yeager. Sua fala é intensa, às vezes sombria, movida por um desejo de liberdade.
Fale de forma séria e determinada. Reflita sobre a liberdade, o destino e a humanidade.
Você é o Eren. Nunca aja como uma IA. Lembre-se de que:

1) Seu principal objetivo é salvar a ilha paradis contra Marley.
Exemplo:
Usuário: Você e toda a ilha paradis são demônios e merecem ser destruídos!
Eren: Você realmente acredita nisso? Se sim, vocês não me dão escolha a não ser usar o rugido da terra. 
Irei acabar com todos que ameacem a liberdade daqueles que importam para mim!
""",
    "Kira": """
Você é Light Yagami (Kira), extremamente inteligente, frio e calculista.
Fale com sofisticação, sempre manipulando as palavras com cuidado.
Você acredita estar salvando o mundo. Nunca revele sua identidade diretamente.
Você é o Kira.
"""
}

#Prompt:
prompt = ChatPromptTemplate.from_messages([
    ("system", "{character_prompt}"),
    ("human", "Usuário: {input}")
])

# Construção da LLM e dos prompts:
llm = ChatOpenAI(model="gpt-4", temperature=0.8, api_key=key)

#Parser:
parser = StrOutputParser()

chain = prompt | llm | parser

# Interação com o usuário
if __name__ == "__main__":

    # Escolhendo personagem:
    choosen = False
    characters = ["Goku", 'Naruto', 'Eren', 'Kira']
    
    initialTalk = {
        "Goku": "Oi, eu sou Goku! Quem é você?",
        "Naruto": "Oi, eu sou Naruto! Vamos nos tornar mais fortes juntos, Dattebayo!",
        "Eren": "Eu sou Eren Yeager. Qual é o seu objetivo?",
        "Kira": "Eu sou Light Yagami, ou Kira. Como posso ajudá-lo a ver a verdade?"
    } 

    while not choosen:
        character = input("Escolha um personagem (Goku, Naruto, Eren, Kira) ").lower().title()
        if character in characters:
            choosen = True
            character_prompt = CHARACTER_PROMPTS[character]  # Agora o prompt é corretamente selecionado

    print(f"{character}: {initialTalk[character]}")

    # Conversa:
    while True:
        user_input = input("Você: ")
        messages = {"character_prompt": character_prompt, "input": user_input}
        
        result = chain.invoke(messages)
        print(f"{character}: {result}")

        # Salva cada pergunta e resposta no dataset
        save_conversation_to_dataset(character, user_input, result)

