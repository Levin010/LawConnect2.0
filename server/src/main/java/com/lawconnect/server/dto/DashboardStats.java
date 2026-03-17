package com.lawconnect.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {
    private long totalCases;
    private long activeClients;
    private long activeCases;
    private long closedCases;
}
