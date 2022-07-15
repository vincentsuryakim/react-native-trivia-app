import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Screen, Text, Button } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { Question, useStores } from "../../models"
import { color, spacing } from "../../theme"
import { decodeHTMLEntities } from "../../utils/html-decode"
import { RadioButtons } from "react-native-radio-buttons"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
  paddingHorizontal: spacing.large,
}

const HEADER_CONTAINER: ViewStyle = {
  marginTop: spacing.huge,
}

const HEADER_TEXT: TextStyle = {
  fontSize: 32,
}

const QUESTION_LIST: ViewStyle = {
  marginBottom: spacing.large,
}

const QUESTION_WRAPPER: ViewStyle = {
  borderBottomColor: color.line,
  borderBottomWidth: 1,
  paddingVertical: spacing.large,
}

const QUESTION: TextStyle = {
  fontWeight: "bold",
  fontSize: 24,
  marginVertical: spacing.medium,
}

const ANSWER: TextStyle = {
  fontSize: 14,
}

const ANSWER_WRAPPER: ViewStyle = {
  paddingVertical: spacing.smaller,
}

const CHECK_ANSWER: ViewStyle = {
  paddingVertical: spacing.smaller,
  backgroundColor: color.palette.angry,
  marginTop: spacing.small,
}

const CHECK_ANSWER_TEXT: TextStyle = { 
  fontSize: 14,
}


export const QuestionScreen: FC<StackScreenProps<NavigatorParamList, "question">> = observer(function QuestionScreen() {
  // Are we refreshing the data
  const [refreshing, setRefreshing] = useState<boolean>(false)

  // Pull in one of our MST stores
  const { questionStore } = useStores()
  const { questions } = questionStore

  useEffect(() => {
    setTimeout(fetchQuestions, 1)
  }, [])

  const fetchQuestions = () => {
    setRefreshing(true)
    questionStore.getQuestions()
    setRefreshing(false)
  }

  const renderQuestion = ({ item }) => {
    const question: Question = item

    return (
      <View style={QUESTION_WRAPPER}>
        <Text style={QUESTION} text={decodeHTMLEntities(question.question)} />
        <View>
          <RadioButtons
            options={question.allAnswers}
            onSelection={guess => onPressAnswer(question, guess)}
            selectedOption={question.guess}
            renderOption={renderAnswer}
          />
          <Button textStyle={CHECK_ANSWER_TEXT} style={CHECK_ANSWER} onPress={() => checkAnswer(question)} text="Check Answer!" />
        </View>
      </View>
    )
  }

  const onPressAnswer = (question: Question, guess: string) => {
    question.setGuess(guess)
  }

  const checkAnswer = (question: Question) => {
    if (question.isCorrect) {
      Alert.alert("That is correct!")
    } else {
      Alert.alert(`Wrong! The correct answer is: ${question.correctAnswer}`)
    }
  }

  const renderAnswer = (answer: string, selected: boolean, onSelect: () => void, index) => {
    const style: TextStyle = selected ? { fontWeight: "bold", fontSize: 16 } : {}

    return (
      <TouchableOpacity key={index} onPress={onSelect} style={ANSWER_WRAPPER}>
        <Text style={{ ...ANSWER, ...style }} text={"• " + decodeHTMLEntities(answer)} />
      </TouchableOpacity>
    )
  }

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={ROOT} preset="fixed">
      <View style={HEADER_CONTAINER}>
        <Text style={HEADER_TEXT} preset="header" tx="questionScreen.header" />
      </View>
      <FlatList
        style={QUESTION_LIST}
        data={questionStore.questions}
        renderItem={renderQuestion}
        extraData={{ extraDataForMobX: questions.length > 0 ? questions[0].question : "" }}
        keyExtractor={item => item.id}
        onRefresh={fetchQuestions}
        refreshing={refreshing}
      />
    </Screen>
  )
})
