import React, { useState } from 'react';
import './ChoiceQuestionLayout.css';

type Question = {
    title: string;
    options: string[];
    answer: string;
    topic: string;
}

type LayoutState = {
    type: 'show_topic',
} | {
    type: 'show_question',
}
    | {
        type: 'show_answer',
    }

function ChoiceQuestionLayout({ question, onNextQuestion }: { question: Question; onNextQuestion?: () => void }) {
    const [state, setState] = useState<LayoutState>({ type: 'show_topic' });
    console.log(state)
    switch (state.type) {
        case 'show_topic':
            return <div className='question-layout show-topic-layout'>
                <h1 className='question-title'>{question.topic}</h1>
                <button className='show-question-button' onClick={() => setState({ type: 'show_question' })}>Show question</button>
            </div>
        case 'show_question':
            return (
                <div className="question-layout">
                    <h1 className="question-title">{question.title}</h1>
                    <div className="question-options">
                        {question.options.map((option) => (
                            <div key={option} className="question-option">
                                <p>{option}</p>
                            </div>
                        ))}
                    </div>
                    <button className="show-question-button" onClick={() => setState({ type: 'show_answer' })}>Reveal answers</button>
                </div>)
        case 'show_answer':
            return (
                <div className="question-layout">
                    <h1 className="question-title">{question.title}</h1>
                    <div className="question-options">
                        {question.options.map((option) => (
                            <div key={option} className="question-option" style={{ backgroundColor: option === question.answer ? 'green' : undefined }}>
                                <p style={{ color: option === question.answer ? 'white' : undefined }}>{option}</p>
                            </div>
                        ))}
                    </div>
                    {onNextQuestion && (
                        <button className="show-question-button" onClick={() => {
                            setState({ type: 'show_topic' });
                            onNextQuestion();
                        }}>Next question</button>
                    )}
                </div>)
        default:
            return null;
    }
}

export default ChoiceQuestionLayout;
