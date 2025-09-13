package com.email.writer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.web.reactive.function.client.WebClientAutoConfiguration;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import javax.xml.crypto.dsig.spec.XSLTTransformParameterSpec;
import java.util.List;
import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    private final String apiKey;

    public EmailGeneratorService( WebClient.Builder weblientBuilder, @Value("${gemini.api.url}")     String baseUrl,
                                  @Value("${gemini.api.key}")  String geminiApiKey){
        this.apiKey = geminiApiKey;
        this.webClient = weblientBuilder.baseUrl(baseUrl).build();
    }

    public String generateEmailReply(EmailReq emailReq) {

        System.out.println("Gemini API raw response: ");

        //  prompt gen

        String prompt= buildPrompt(emailReq);


        // json str.

        Map<String, Object> ReqBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        //   send req

        String Response = webClient.post()
                .uri(uriBuilder -> uriBuilder.path("/v1beta/models/gemini-2.0-flash:generateContent")
                        .queryParam("key",apiKey)
                        .build())
                //.header("X-goog-api-key",apiKey)
                .header("Content-Type","application/json")
                .bodyValue(ReqBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        // extraction of res;

        return extarctResContent(Response);
    }

    private String extarctResContent(String response) {


        try {

            ObjectMapper mapper= new ObjectMapper();
            JsonNode route=mapper.readTree(response);
            return    route.path("candidates").get(0)   // navigation : cand-> content->... json k liye
                     .path("contents").get(0)
                            .path("parts").get(0)
                            .path("text").asText();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse",e);
        }
    }

    private String buildPrompt(EmailReq emailReq) {

        StringBuilder prompt= new StringBuilder();  // why? as String can not change(immmutable)
        prompt.append("Generate a professional email reply for the given/following email");

        if(emailReq.getTone()!=null && !emailReq.getTone().isEmpty())
        {

            prompt.append("Use a    ").append(emailReq.getTone()).append("tone");

        }

        prompt.append("Original email:").append(emailReq.getContent());
        return prompt.toString() ;
    }
}
