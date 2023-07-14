import React, {useState, useEffect} from 'react'
import Accordion from 'react-bootstrap/Accordion'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import _ from 'lodash';

const UserDetailsProfile = ({ data }) => {

    const [currentOption, setCurrentOption] = useState('basic')
    const [displayData, setDisplayData] = useState(data)

    useEffect(() => {

        if(!data) return
        if(currentOption === 'basic') setDisplayData({profile: data.profile})
        if(currentOption === 'complete') setDisplayData(data)
        if(currentOption === 'nolinks') setDisplayData(_.omit(data, ['_links']))

    }, [currentOption, data])

    return (
        <Accordion defaultActiveKey="0" alwaysOpen>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Profile</Accordion.Header>
                <Accordion.Body style={{padding: 0.5 + 'rem'}}>

                    <div className="btn-group" style={{marginBottom: 0.5 + 'rem'}}>
                        <button className={currentOption === 'basic' ? 'btn btn-outline-secondary active' : 'btn btn-outline-secondary'} onClick={() => setCurrentOption('basic')} aria-current="page">Basic</button>
                        <button className={currentOption === 'nolinks' ? 'btn btn-outline-secondary active' : 'btn btn-outline-secondary'} onClick={() => setCurrentOption('nolinks')} aria-current="page">No links</button>
                        <button className={currentOption === 'complete' ? 'btn btn-outline-secondary active' : 'btn btn-outline-secondary'} onClick={() => setCurrentOption('complete')} aria-current="page">Complete</button>
                    </div>

                    <SyntaxHighlighter className='jsonHighlighter' language="json" style={dark}>
                        {JSON.stringify(displayData, null, 2)}
                    </SyntaxHighlighter>

                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default UserDetailsProfile