import os
from dotenv import load_dotenv

# Langchain imports:
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory

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

# Construção da LLM e dos prompts:
llm = ChatOpenAI(model="gpt-4", temperature=0.8, api_key=key)

# Prompt template com histórico
prompt = ChatPromptTemplate.from_messages([
    ("system", f"O seguinte é um bate-papo com {{}}, {{}}, você é o personagem escolhido."),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

# Memória da conversa
memory = ConversationBufferMemory(return_messages=True)

# Cadeia com histórico usando RunnableWithMessageHistory
chain = RunnableWithMessageHistory(
    prompt | llm,
    lambda session_id: InMemoryChatMessageHistory(),  # Pode mudar para persistente depois
    input_messages_key="input",
    history_messages_key="history",
)

# Interação com o usuário
if __name__ == "__main__":

    # Escolhendo personagem:
    choosen = False
    characters = ["goku", 'naruto', 'eren', 'kira']
    while not choosen:
        session_id = input("Escolha um personagem (Goku, Naruto, Eren, Kira)").lower()
        if session_id in characters:
            choosen = True
            character = session_id.title() 
            character_prompt = CHARACTER_PROMPTS[character]  # Agora o prompt é corretamente selecionado

    # Conversa:
    while True:
        user_input = input("Você: ")
        result = chain.invoke(
            {"input": user_input, "history": memory.load_memory_variables({})},
            config={"configurable": {"session_id": session_id}}
        )
        print(f"{character}: {result.content}\n")