import React from 'react'
import { Button, Icon, Label } from 'semantic-ui-react'

 const LikeButton = (props) => (
  
  props.upVotedByUser? 
  
  <div >


    <Button as='div' labelPosition='right' onClick={props.click} animated>
      <Button color='red'>
        
        <Button.Content visible><Icon name='heart ' /> liked</Button.Content> 
      <Button.Content hidden> unlike </Button.Content>
      </Button>
      <Label as='a' basic color='red' pointing='left'>
      {props.count}
      </Label>
    </Button>
    
  </div>

  :

  <div >
  <Button as='div' labelPosition='right' onClick={props.click} animated >
    <Button  color='red'>
      
      <Button.Content visible><Icon name='heart outline' /> likes</Button.Content> 
      <Button.Content hidden>like</Button.Content>
    </Button>
    <Label as='a' basic color='red' pointing='left'>
    {props.count}
    </Label>
  </Button>
  
</div>
)

export default LikeButton