package com.lawconnect.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReadReceiptDto {
    private String conversationId;
    private String readerId;
}
