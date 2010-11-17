<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
[<%
String pId = request.getParameter("id");
String pName = request.getParameter("name");
if (pId==null) pId = "0";
if (pName==null) pName = "";

//for (int j=0; j<999999; j++) {
	for (int i=0; i<99999; i++) {
		System.out.println(i*i/3*45/0.2*0.125486);
	}
//}
for (int i=1; i< 5; i++) {
	String nId = pId + i;
	String nName = "tree" + nId;
	%>{ "id":"<%=nId%>",	"name":"<%=nName%>",	"icon":"", isParent:<%=(i%2==0)%>}<%
	if (i<4) {
		%>,<%
	}
	
}
%>]