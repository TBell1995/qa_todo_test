import {
  Builder,
  By,
  Capabilities,
  until,
  WebDriver,
} from "selenium-webdriver";
import { DriverService } from "selenium-webdriver/remote";

const chromedriver = require("chromedriver");

const driver: WebDriver = new Builder()
  .withCapabilities(Capabilities.chrome())
  .build();


class TodoPage {
  todoInput: By = By.className("new-todo");
  todos: By = By.css("li.todo");
  todoLabel: By = By.css("label");
  todoComplete: By = By.css("input");
  todoStar: By = By.className("star");
  starBanner: By = By.className("starred");
  todoCount: By = By.className("todo-count");
  clearCompletedButton: By = By.css("button.clear-completed");


  driver: WebDriver;

  url: string = "https://devmountain.github.io/qa_todos/"

  constructor(driver: WebDriver) {
    this.driver = driver;
  }
}
const tp = new TodoPage(driver);

describe("the todo app", () => {
  beforeEach(async () => {
    await driver.get(tp.url);
  });

  afterAll(async () => {
    await driver.quit();
  });

  //This test will add a todo
  it("can add a todo", async () => {
    await driver.wait(until.elementLocated(tp.todoInput));
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do\n");
  });

  //This test will remove a todo
  //We will check the lenth of the todo at the end
  it("can remove a todo", async () => {
    let myTodos = await driver.findElements(tp.todos);
    await myTodos
      .filter(async (todo) => {
        (await (await todo.findElement(tp.todoLabel)).getText()) ==
          "Test To-Do";
      })[0]
      .findElement(tp.todoComplete)
      .click();
    await (await driver.findElement(tp.clearCompletedButton)).click();
    myTodos = await driver.findElements(tp.todos);
    let myTodo = await myTodos.filter(async (todo) => {
      (await (await todo.findElement(tp.todoLabel)).getText()) == "Test To-Do";
    });
    expect(myTodo.length).toEqual(0);
  });

  //This test will add a todo and then click the "star" 
  //We will count all starred todos at the start, and again at the end
  it("can mark a todo with a star", async () => {
    await driver.wait(until.elementLocated(tp.todoInput));
    let startingStars = await (await driver.findElements(tp.starBanner)).length;
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do\n");
    await (await driver.findElements(tp.todos))
      .filter(async (todo) => {
        (await (await todo.findElement(tp.todoLabel)).getText()) ==
        "Test To-Do";
      })[0]
      .findElement(tp.todoStar).click();
    let endingStars = await (await driver.findElements(tp.starBanner)).length;
    expect(endingStars).toBeGreaterThan(startingStars);
    
  });

  //This test will add a number of todos
  //and check the number of todos listed at the end is correct
  it("has the right number of todos listed", async () => {
    await driver.wait(until.elementLocated(tp.todoInput));
    let startingTodoCount = await (await driver.findElements(tp.todos)).length;
  // We will add 3 Todos
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 1\n");
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 2\n");
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 3\n");
    let endingTodoCount = await (await driver.findElements(tp.todos)).length;
    let message = await (await driver.findElement(tp.todoCount)).getText();

    expect(endingTodoCount - startingTodoCount).toBe(3);
    expect(message).toBe('${endingToDoCount} items left');
  });
});
