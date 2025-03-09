package com.tus.EduDNSFilter.server.service;

import org.springframework.stereotype.Service;
import org.xbill.DNS.*;
import org.xbill.DNS.Record;

import java.util.logging.Logger;


@Service
public class DNSResolverService {
    private static final Logger LOGGER = Logger.getLogger(DNSResolverService.class.getName());

    private final BlockedDomainService blockedDomainService;
    private final DomainLogService domainLogService;
    private final String UPSTREAM_DNS = "1.1.1.1";

    public DNSResolverService(BlockedDomainService blockedDomainService, DomainLogService domainLogService) {
        this.blockedDomainService = blockedDomainService;
        this.domainLogService = domainLogService;
    }

    public Message resolveDNS(Message query) {
        Record question = query.getQuestion();
        if (question == null) {
            LOGGER.warning("No question found in query");
            return buildErrorResponse(query, Rcode.FORMERR);
        }
        String domain = question.getName().toString(true);
        LOGGER.info("Received query for: " + domain);

        boolean isBlocked = blockedDomainService.isDomainBlocked(domain);
        
        // Log domain query with blocked status
        domainLogService.logDomain(domain, isBlocked);

        if (isBlocked) {
            LOGGER.info("Domain is blocked: " + domain);
            return buildErrorResponse(query, Rcode.NXDOMAIN);
        }

        try {
            SimpleResolver resolver = new SimpleResolver(UPSTREAM_DNS);
            Message response = resolver.send(query);
            LOGGER.info("Forwarded query and received response");
            return response;
        } catch (Exception e) {
            LOGGER.severe(e.toString());
            return buildErrorResponse(query, Rcode.SERVFAIL);
        }
    }

    private Message buildErrorResponse(Message query, int rcode) {
        Message response = new Message(query.getHeader().getID());
        Header header = response.getHeader();
        header.setFlag(Flags.QR);  // Mark as a response.
        header.setRcode(rcode);
        response.addRecord(query.getQuestion(), Section.QUESTION);
        return response;
    }
}

