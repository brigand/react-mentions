import React from 'react'

import { Mention, MentionsInput } from '../../../src'

import { provideExampleValue } from './higher-order'

import defaultStyle from './defaultStyle'
import defaultMentionStyle from './defaultMentionStyle'

const maxHeight = '6em';

const style = {
  ...defaultStyle,
  input: {
    ...defaultStyle,
    maxHeight,
    overflowY: 'auto',
  },
};

function Scroll({ value, data, onChange, onAdd, type }) {
  return (
    <div className="avoid-edge">
      <h3>{`textarea set with max height`}</h3>

      <div>
        <MentionsInput
          value={ value }
          onChange={ onChange }
          style={ style }
          markup="@[__display__](__type__:__id__)"
          placeholder={"Mention people using '@'"}
          avoid={{
            type: 'viewport',
            // The header covers the top of the mention suggestions
            margins: { top: 82 },
          }}
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

const asExample = provideExampleValue('Hi @[John Doe](user:johndoe)\n\n'.repeat(20))

export default asExample(Scroll)
