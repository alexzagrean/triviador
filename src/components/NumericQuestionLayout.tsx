import React, { useState } from 'react';
import './NumericQuestionLayout.css';
import { NumericQuestion } from '../numericQuestions';

type LayoutState = {
    type: 'show_topic',
} | {
    type: 'show_question',
} | {
    type: 'show_answer',
}

function NumericQuestionLayout({ question, onNextQuestion }: { question: NumericQuestion; onNextQuestion?: () => void }) {
    const [state, setState] = useState<LayoutState>({ type: 'show_topic' });
    
    switch (state.type) {
        case 'show_topic':
            return (
                <div className="question-layout show-topic-layout">
                    <button className="show-question-button" onClick={() => setState({ type: 'show_question' })}>Show question</button>
                </div>)
        case 'show_question':
            return (
                <div className="question-layout show-topic-layout">
                    <h1 className="question-title">{question.title}</h1>
                    <button className="show-question-button" onClick={() => setState({ type: 'show_answer' })}>Reveal answer</button>
                </div>)
        case 'show_answer':
            return (
                <div className="question-layout show-topic-layout">
                    <h1 className="question-title">{question.title}</h1>
                    <div style={{
                        fontSize: '120px',
                        fontWeight: 'bold',
                        color: '#4a90e2',
                        marginTop: '40px'
                    }}>
                        {question.answer}
                    </div>
                    {onNextQuestion && (
                        <button className="show-question-button" onClick={() => {
                            setState({ type: 'show_topic' });
                            onNextQuestion();
                        }} style={{ marginTop: '40px' }}>Next question</button>
                    )}
                </div>)
        default:
            return null;
    }
}

export default NumericQuestionLayout;

