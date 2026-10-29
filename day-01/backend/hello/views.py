from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# 1. GET /api/hello/
class HelloShivaniView(APIView):
    def get(self, request):
        return Response({"message": "Hello Shivani"})

# 2. GET /api/hello/<name>/
class HelloKashiView(APIView):
    def get(self, request, name):
        return Response({"message": f"Hello {name}"})

# 3. POST /api/add/
class AddNumbersView(APIView):
    def post(self, request):
        data = request.data
        a = data.get('a')
        b = data.get('b')
        
        # Return 400 Bad Request if parameters are missing
        if a is None or b is None:
            return Response(
                {"error": "Missing parameters 'a' or 'b' in JSON payload."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            result = int(a) + int(b)
            return Response({"result": result})
        except (ValueError, TypeError):
            return Response(
                {"error": "Parameters 'a' and 'b' must be integers."},
                status=status.HTTP_400_BAD_REQUEST
            )
