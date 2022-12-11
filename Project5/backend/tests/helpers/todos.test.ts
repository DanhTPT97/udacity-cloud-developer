import { AttachmentUtils } from "../../src/helpers/attachmentUtils";
import { createAttachmentPresignedUrl, createTodo, deleteTodo, getTodosForUser, updateTodo } from "../../src/helpers/todos";
import { TodosAccess } from "../../src/helpers/TodosAccess"
import { TodoItem } from "../../src/models/TodoItem";
import { CreateTodoRequest } from "../../src/requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../../src/requests/UpdateTodoRequest";

const AWSXRay = require('aws-xray-sdk')

jest.mock('../../src/helpers/todosAccess')
jest.mock('../../src/helpers/attachmentUtils')
jest.spyOn(AWSXRay, 'captureAWS')

const currentDate = new Date()
const toDoName = "todoName"
const userId = "user"

const expectedTodoItem: TodoItem = {
    userId: userId,
    todoId: "todoId",
    createdAt: currentDate.toISOString(),
    name: toDoName,
    dueDate: currentDate.toISOString(),
    done: false,
    attachmentUrl: "https://somepicture.com"
}

describe('Testing getToDos', () => {

    test('Success get todos', async () => {
        const expectedToDoItems: TodoItem[] = [expectedTodoItem];
        TodosAccess.prototype.getTodos = jest.fn().mockReturnValue(expectedToDoItems)
        try {
            const result = await getTodosForUser(userId)
            expect(result.length).toEqual(expectedToDoItems.length)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here');
        }
    });

    test('Success get empty todos array with new user', async () => {
        const emptyToDoItems: TodoItem[] = [];
        TodosAccess.prototype.getTodos = jest.fn().mockReturnValue(emptyToDoItems)
        try {
            const result = await getTodosForUser("new_user")
            expect(result.length).toEqual(0)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here');
        }
    });
});

describe('Testing createTodo', () => {

    test('Success create todo', async () => {
        const createTodoRequest: CreateTodoRequest = {
            name: toDoName,
            dueDate: currentDate.toISOString()
        };
        TodosAccess.prototype.createTodo = jest.fn().mockReturnValue(expectedTodoItem)
        try {
            const result = await createTodo(userId, createTodoRequest)
            expect(result.name).toEqual(expectedTodoItem.name)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here');
        }
    });

    test('Success create todo with empty parameter', async () => {
        const emptyCreateTodoRequest: CreateTodoRequest = {
            name: '',
            dueDate: ''
        };
        TodosAccess.prototype.createTodo = jest.fn().mockReturnValue(expectedTodoItem)
        try {
            const result = await createTodo(userId, emptyCreateTodoRequest)
            expect(result.name).toEqual('')
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here');
        }
    });
});

describe('Testing updateToDo', () => {

    test('Success update todo', async () => {
        const updateTodoRequest: UpdateTodoRequest = {
            name: toDoName,
            dueDate: currentDate.toISOString(),
            done: true
        };
        const todoId = "toDoId";
        TodosAccess.prototype.updateTodo = jest.fn().mockImplementationOnce(() => Promise.resolve())
        try {
            await updateTodo(userId, todoId, updateTodoRequest)
            expect(TodosAccess.prototype.updateTodo).toHaveBeenCalledTimes(1);
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here');
        }
    });

    test('Fail to update todo', async () => {
        const updateTodoRequest: UpdateTodoRequest = {
            name: toDoName,
            dueDate: currentDate.toISOString(),
            done: true
        };
        const todoId = "toDoId";
        const error = new Error(`Not found todo item id for user ${userId}`);
        TodosAccess.prototype.updateTodo = jest.fn().mockRejectedValue(error)
        try {
            const result = await updateTodo(userId, todoId, updateTodoRequest)
            expect(result).toEqual('It should not reach here')
        } catch (exception) {
            expect(exception.message).toBe(error.message);
        }
    });
});

describe('Testing deleteToDo', () => {

    test('Success delete todo', async () => {
        const todoId = "toDoId";
        TodosAccess.prototype.deleteTodo = jest.fn().mockImplementationOnce(() => Promise.resolve())
        try {
            await deleteTodo(userId, todoId)
            expect(TodosAccess.prototype.deleteTodo).toHaveBeenCalledTimes(1)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here');
        }
    });
});

describe('Testing createAttachmentPresignedUrl', () => {

    test('Success create AttachmentPresignedUrl', async () => {
        const todoId = "toDoId";
        const attachmentUrl = "https://somepicture.com";
        AttachmentUtils.prototype.generateUploadURL = jest.fn().mockReturnValue(attachmentUrl);
        try {
            const result = await createAttachmentPresignedUrl(userId, todoId)
            expect(result).toEqual(attachmentUrl)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here');
        }
    });

    test('Fail to create AttachmentPresignedUrl', async () => {
        const todoId = "toDoId";
        const error = new Error(`Not found todo item id for user ${userId}`);
        AttachmentUtils.prototype.generateUploadURL = jest.fn().mockRejectedValue(error);
        try {
            const result = await createAttachmentPresignedUrl(userId, todoId)
            expect(result).toEqual('It should not reach here')
        } catch (exception) {
            expect(exception.message).toBe(error.message);
        }
    });
});