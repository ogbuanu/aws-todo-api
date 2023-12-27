import dynamoDBClient from "../models";
import TodoService from "./TodoService";

const todoService = new TodoService(dynamoDBClient());

export default todoService;
