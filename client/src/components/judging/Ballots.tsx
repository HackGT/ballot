import * as React from 'react';
import { H1, H2, H3, H4, Button, Slider } from '@blueprintjs/core';
import { BallotState, ProjectState, CategoryState } from '../../types/State';
import Ballot from './Ballot';

interface BallotsProps {
    ballotStatus: string;
    project: ProjectState;
    criteriaToBallot: { [criteriaID: number]: BallotState };
    updateBallot: (ballot: BallotState) => void;
    startProject: () => void;
    scoreProject: () => void;
    skipProject: () => void;
}

const Ballots: React.SFC<BallotsProps> = (props) => {
    if (props.ballotStatus === 'Assigned') {
        return (
            <div style={{
                textAlign: 'center',
            }}>
                <H4 style={{
                    marginTop: '20px',
                }}>Your next project is...</H4>
                <a href={props.project.devpost_id} target='_blank'><H1 style={{
                    fontSize: '3em',
                    marginBottom: '20px',
                }}>{props.project.name}</H1></a>

                <H2>At table {props.project.table_number}</H2>

                <p>Once you find the table and project, press "I'm Here!"</p>

                <Button
                    text={`I'm here!`}
                    large={true}
                    intent='success'
                    onClick={props.startProject}
                    style={{
                        fontSize: '2em',
                        padding: '20px 40px',
                        margin: '10px 0 20px',
                    }} />

                <br />

                <Button
                    text='Skip Project'
                    large={true}
                    intent='danger'
                    onClick={props.skipProject}
                    minimal={true} />
            </div>
        )
    } else {
        return (
            <div style={{
                textAlign: 'center',
            }}>
                <a href={props.project.devpost_id} target='_blank'><H1 style={{
                    fontSize: '3em',
                }}>{props.project.name}</H1></a>
                <p style={{
                    marginBottom: '20px',
                }}><strong>Table {props.project.table_number}</strong></p>

                {props.project.categories!.map((category) => {
                    return (
                        <div
                            key={category.category_id}
                            style={{
                                marginBottom: '30px',
                            }}>
                            <h3>Category:</h3>
                            <H2>{category.name}</H2>
                            {category.criteria.map((criteria) => {
                                const ballot = props.criteriaToBallot[criteria.criteria_id];

                                ballot.score = criteria.min_score;

                                return (
                                    <Ballot
                                        key={criteria.criteria_id}
                                        criteria={criteria}
                                        ballot={ballot}
                                        updateBallot={props.updateBallot} />
                                );
                            })}
                        </div>
                    )
                })}

                <Button
                    text='Submit Scores'
                    large={true}
                    intent='success'
                    onClick={props.scoreProject}
                    style={{
                        margin: '10px 0 20px',
                    }} />

                <br />

                <Button
                    text='Skip Project'
                    large={true}
                    intent='danger'
                    onClick={props.skipProject}
                    minimal={true} />
            </div>
        )
    }
}

export default Ballots;
