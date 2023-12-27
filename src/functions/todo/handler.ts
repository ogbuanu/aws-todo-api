import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { v4 } from "uuid";
import todoService from "src/services";

export const getAllTodos = middyfy(async (): Promise<APIGatewayProxyResult> => {
  const todos = await todoService.getAllTodos();
  return formatJSONResponse({ todos });
});

export const createTodo = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const id = v4();
      const body = event.body as any;

      const todo = await todoService.createTodo({
        todosId: id,
        title: body.name,
        description: body.description,
        status: false,
        createdAt: new Date().toISOString(),
      });
      return formatJSONResponse({ todo });
    } catch (error: any) {
      return formatJSONResponse({ error: error.message }, 500);
    }
  }
);
export const getTodo = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;
    try {
      const todo = await todoService.getTodo(id);
      return formatJSONResponse({ todo });
    } catch (error: any) {
      return formatJSONResponse({ error: error.message }, 500);
    }
  }
);

export const updateTodo = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
      let todo = await todoService.updateTodo(id);
      return formatJSONResponse({
        todo,
        id,
      });
    } catch (e) {
      return formatJSONResponse({
        status: 500,
        message: e,
      });
    }
  }
);

export const deleteTodo = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
      const todo = await todoService.deleteTodo(id);
      return formatJSONResponse({ todo, id });
    } catch (error: any) {
      return formatJSONResponse({ error: error.message }, 500);
    }
  }
);
