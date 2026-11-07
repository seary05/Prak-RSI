import { AuditRepository, type CreateAuditInput } from '../repositories/auditRepository.ts';

export class AuditService {
  constructor(private auditRepository: AuditRepository = new AuditRepository()) {}

  getAuditLogs() {
    return this.auditRepository.findAll();
  }

  createAuditLog(input: Omit<CreateAuditInput, 'metadata'> & { metadata?: unknown }) {
    return this.auditRepository.create({
      ...input,
      metadata: input.metadata === undefined || input.metadata === null ? null : JSON.stringify(input.metadata),
    });
  }
}