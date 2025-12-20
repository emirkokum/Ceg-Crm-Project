using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using CegCRMAPI.Application.DTOs.Note;
using CegCRMAPI.Application.Repositories;

namespace CegCRMAPI.Application.Features.Queries.Note.GetNotesForLead
{
    public class GetNotesForLeadQuery : IRequest<List<NoteDto>>
    {
        public Guid LeadId { get; set; }
    }

    public class GetNotesForLeadQueryHandler : IRequestHandler<GetNotesForLeadQuery, List<NoteDto>>
    {
        private readonly INoteRepository _noteRepository;

        public GetNotesForLeadQueryHandler(INoteRepository noteRepository)
        {
            _noteRepository = noteRepository;
        }

        public async Task<List<NoteDto>> Handle(GetNotesForLeadQuery request, CancellationToken cancellationToken)
        {
            var notes = await _noteRepository.GetNotesByLeadIdAsync(request.LeadId);
            return notes.Select(note => new NoteDto
            {
                Id = note.Id,
                Content = note.Content,
                CustomerId = note.CustomerId,
                LeadId = note.LeadId,
                TicketId = note.TicketId,
                SaleId = note.SaleId,
                TaskId = note.TaskId,
                CreatedDate = note.CreatedDate,
                UpdatedDate = note.UpdatedDate
            }).ToList();
        }
    }
} 