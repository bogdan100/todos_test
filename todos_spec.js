
var origFn = browser.driver.controlFlow().execute;
//to slow down the protractor
browser.driver.controlFlow().execute = function() {
  var args = arguments;

  // queue 100ms wait
  origFn.call(browser.driver.controlFlow(), function() {
    return protractor.promise.delayed(100);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};

describe('To test the "todos" app', function() {

	beforeEach(function(){
		browser.get('http://todomvc.com/examples/angularjs');
	});

	it('should enter 5 tasks', function() {
		element(by.css('#new-todo')).sendKeys('Task 1', protractor.Key.ENTER);		
		element(by.css('#new-todo')).sendKeys('Task 2', protractor.Key.ENTER);
		element(by.css('#new-todo')).sendKeys('Task 3', protractor.Key.ENTER);
		element(by.css('#new-todo')).sendKeys('Task 4', protractor.Key.ENTER);	
		element(by.css('#new-todo')).sendKeys('Task 5', protractor.Key.ENTER);	

		//check how many tasks were entered
		element(by.binding('remainingCount')).getText().then(function(num){
			expect(num).toEqual('5'); 
		});
	});

	it('should mark two tasks', function() {
		element(by.css('#todo-list > li:nth-child(1) > div > input')).click();
		element(by.css('#todo-list > li:nth-child(3) > div > input')).click();

		//check how many tasks were marked
		element(by.binding('remainingCount')).getText().then(function(num){
			expect(num).toEqual('3'); 
		});
	});

	it('should select active, completed and all tasks', function() {
		element(by.css('#filters > li:nth-child(2) > a')).click();
		element(by.css('#filters > li:nth-child(3) > a')).click();
		element(by.css('#filters > li:nth-child(1) > a')).click();
	});

	it('should edit second task', function() {

		browser.actions().doubleClick(element(by.css('#todo-list > li:nth-child(2) > div > label'))).perform();
		element(by.css('#todo-list > li:nth-child(2) > form > input')).clear();
		element(by.css('#todo-list > li:nth-child(2) > form > input')).sendKeys('Task 2000', protractor.Key.ENTER);

		//the second task should contain "Task 2000"
		element.all(by.binding('todo.title')).get(1).getText().then(function(txt){
			expect(txt).toEqual('Task 2000'); 
		}); 
	});

	it('should delete second task', function() {
		browser.actions().mouseMove(element(by.css('#todo-list > li:nth-child(2) > div > label'))).perform();
		element(by.css('#todo-list > li:nth-child(2) > div > button')).click();
	});

	it('should delete completed task', function() {
		browser.actions().mouseMove(element(by.css('button#clear-completed'))).perform();
		browser.actions().click().perform();
	});

	it('should mark all tasks and delete them', function() {
		element(by.css('#toggle-all')).click();
		browser.actions().mouseMove(element(by.css('button#clear-completed'))).perform();
		browser.actions().click().perform();

		//check if tasks are exist
		expect(element(by.css('#todo-list li')).isPresent()).toBe(false);
	});
});
	