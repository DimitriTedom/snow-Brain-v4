# Vapi Debugging Guide for SnowBrain

## Issues Fixed

### 1. Speech Configuration Problems
- **Added proper `startSpeakingPlan`**: Wait 1.2 seconds before assistant speaks to avoid interruptions
- **Added proper `stopSpeakingPlan`**: Allow user to speak 3+ words before stopping assistant
- **Enabled smart endpointing**: Better detection of when user finishes speaking

### 2. Conversation Flow Issues
- **Improved system prompt**: Made it clear this is an INTERACTIVE session, not a lecture
- **Better first message**: More engaging and clear about what the user should do
- **Added conversation flow guidelines**: Assistant must always ask questions and engage

### 3. Better Error Handling & Debugging
- **Added comprehensive logging**: Debug panel shows real-time events
- **Improved error handling**: Better catch and display of errors
- **Enhanced message handling**: More robust transcript processing

### 4. Technical Improvements
- **Fixed message configuration**: Proper client/server message settings
- **Better variable substitution**: Cleaner handling of topic, subject, style variables
- **Improved call lifecycle**: Better handling of call start/end events

## How to Test

1. **Start a session** and watch the debug panel (bottom of screen in development)
2. **Check console logs** for detailed event information
3. **Verify the first message** includes the topic and asks for engagement
4. **Test user interaction** by responding to the assistant's questions

## Common Issues & Solutions

### Issue: Call ends after introduction
**Solution**: 
- Assistant now asks engaging questions that require responses
- Better speech detection prevents premature ending
- Improved conversation flow keeps dialogue active

### Issue: Assistant doesn't respond to user
**Solution**:
- Fixed transcript message handling
- Added proper speech start/end detection
- Improved variable substitution in prompts

### Issue: Poor conversation flow
**Solution**:
- Updated system prompt emphasizes interactivity
- Added conversation flow examples
- Assistant now always asks questions to keep dialogue going

## Debug Panel Information

The debug panel shows:
- Call start/end events
- Speech detection events
- Message handling (transcripts, errors)
- Volume levels
- Configuration issues

## Key Configuration Changes

```typescript
// Better speech timing
startSpeakingPlan: {
  waitSeconds: 1.2, // Prevents interrupting user
  smartEndpointingEnabled: true, // Better end-of-speech detection
},

// Allows natural conversation
stopSpeakingPlan: {
  numWords: 3, // User can say more before stopping assistant
  voiceSeconds: 0.8, // More natural speech detection
  backoffSeconds: 1.5, // Quick recovery after interruption
},

// Interactive system prompt
"This is a LIVE VOICE conversation. You MUST keep the conversation flowing naturally."
"Always end your responses with a question or prompt to keep the conversation going."
"NEVER just give information without asking for feedback or engagement."
```

## Expected Behavior

1. **Call starts** → Debug shows "Call started successfully"
2. **Assistant speaks first** → Engaging introduction with clear prompt for user response
3. **User responds** → Debug shows transcript capture
4. **Assistant continues** → Interactive teaching with questions
5. **Natural flow** → Back-and-forth conversation continues until user or assistant ends

## Troubleshooting

If the call still ends after introduction:
1. Check debug panel for error messages
2. Verify VAPI token is valid
3. Check browser microphone permissions
4. Ensure stable internet connection
5. Try refreshing and starting again

The system is now configured for natural, flowing conversation that should persist beyond the introduction message.