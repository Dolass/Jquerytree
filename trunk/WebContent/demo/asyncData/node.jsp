<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
[<%
String pId = request.getParameter("id");
String pName = request.getParameter("name");
if (pId==null) pId = "0";
if (pName==null) pName = "";

for (int i=1; i< 5; i++) {
	String nId = pId + i;
	String nName = "tree" + nId;
	%>{ "id":"<%=nId%>",	"name":"<%=nName%>",	"icon":"", isParent:<%=(i%2==0)%>}<%
	if (i<4) {
		%>,<%
	}
	
}
%>]