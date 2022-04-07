# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher


class ActionMyName(Action):

    @staticmethod
    def name() -> Text:
        return "action_ask_name"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        my_name = tracker.get_slot('name')
        print(my_name)
        dispatcher.utter_message(text="Hello World!")

        return []


class ETEStaff(Action):

    def name(self) -> Text:
        return "action_ETE_staff"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        global message, name
        entities = tracker.latest_message['entities']
        print(entities)

        for e in entities:
            if e['entity'] == 'staff':
                name = e['value']
            if name == "Baraka Maiseli":
                message = " Senior Lecturer and HOD \n  barakaezra@udsm.ac.tz / 0762251260 \n Office #: D25"
            if name == "Abdi Abdallah":
                message = " Senior Lecturer  \n  abdit@udsm.ac.tz / 0776188588 \n Office #: A018"
            if name == "Alfred Mwambela":
                message = " Senior Lecturer  \n  nkomo98@udsm.ac.tz / 0754566655 \n Office #: A008"
            if name == "Omar Hamad":
                message = " Senior Lecturer  \n  omarhf@udsm.ac.tz / 0772219999 \n Office #: B017"
            if name == "Mussa Kissaka":
                message = " Senior Lecturer \n  kissaka.mussa@udsm.ac.tz / 0782431131 \n Office #: B018"
        dispatcher.utter_message(Text= message)

        return []
