/**
 * Utility script to initialize Back4App classes with proper permissions
 * Run this in the browser console after Parse is initialized
 * OR create classes manually in Back4App dashboard
 */

import Parse from 'parse';

/**
 * Initialize Back4App classes - creates classes if they don't exist
 * Note: This requires Master Key access, which you may not have
 * Better to create classes manually in Back4App dashboard
 */
export const initializeBack4AppClasses = async () => {
  try {
    console.log('Initializing Back4App classes...');
    
    // Test if we can create a MoodEntry
    const testEntry = new Parse.Object('MoodEntry');
    testEntry.set('test', true);
    await testEntry.save();
    await testEntry.destroy(); // Clean up test entry
    
    console.log('✓ MoodEntry class is accessible');
    
    // Test MoodOptions
    const testOption = new Parse.Object('MoodOptions');
    testOption.set('category', 'test');
    testOption.set('value', 'test');
    testOption.set('label', 'Test');
    await testOption.save();
    await testOption.destroy();
    
    console.log('✓ MoodOptions class is accessible');
    
    // Test MoodColors
    const testColor = new Parse.Object('MoodColors');
    testColor.set('mood', 'test');
    testColor.set('color', '#000000');
    testColor.set('name', 'Test');
    await testColor.save();
    await testColor.destroy();
    
    console.log('✓ MoodColors class is accessible');
    
    console.log('All classes initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing classes:', error);
    console.log('Please create classes manually in Back4App dashboard:');
    console.log('1. Go to Core → Database');
    console.log('2. Create classes: MoodEntry, MoodOptions, MoodColors');
    console.log('3. Set permissions: Read=public, Write=public');
    return false;
  }
};

