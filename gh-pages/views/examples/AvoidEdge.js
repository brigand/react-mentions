import React from 'react'

import { Mention, MentionsInput } from '../../../src'

import { provideExampleValue } from './higher-order'

import defaultStyle from './defaultStyle'
import defaultMentionStyle from './defaultMentionStyle'

function AvoidEdge({ value, data, onChange, onAdd, type }) {
  return (
    <div className="avoid-edge">
      <h3>{`Avoids edges of ${type === 'viewport' ? 'the viewport' : 'a container'}`}</h3>

      <div className={type === 'container' && 'avoid-edge-container'}>
        <MentionsInput
          value={ value }
          onChange={ onChange }
          style={ defaultStyle }
          markup="@[__display__](__type__:__id__)"
          placeholder={"Mention people using '@'"}
          avoid={type === 'viewport'
            ? { type: 'viewport' }
            : { type: 'container', parentSelector: '.avoid-edge-container' }
          }
        >
          <Mention
            type="user"
            trigger="@"
            data={ data }
            renderSuggestion={ (suggestion, search, highlightedDisplay) => (
              <div className="user">
                { highlightedDisplay }
              </div>
            )}
            onAdd={ onAdd }
            style={defaultMentionStyle}
          />
        </MentionsInput>
      </div>
    </div>
  )
}

const asExample = provideExampleValue('Hi @[John Doe](user:johndoe)')

export default asExample(AvoidEdge)
